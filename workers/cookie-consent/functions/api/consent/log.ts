// Cloudflare Pages Function: consent audit log (optional).
// POST /api/consent/log — records a proof-of-consent entry, because GDPR
// requires a controller to be able to DEMONSTRATE that consent was given
// (Art. 7(1)). The visitor's choice is always stored client-side first; this
// endpoint is a best-effort server record and must never block the choice.
//
// What is stored (KV, one entry per consent event):
//   ts          ISO timestamp
//   country     edge-resolved country
//   categories  the categories the visitor granted (e.g. ["analytics"])
//   version     the policy version in force when they consented
//   ipHash      SHA-256(salt + IP) — the IP is PII, so only a salted hash is
//               kept; enough to correlate/deduplicate, not to re-identify
//   ua          user-agent string
//
// Bindings / config (all optional — the endpoint degrades gracefully):
//   CONSENT_LOG            KV namespace binding; without it, nothing is stored
//   TURNSTILE_SECRET       if set, a Turnstile token is verified (anti-flood)
//   CONSENT_IP_SALT        salt for the IP hash; set one to make hashes stable
//   CONSENT_RETENTION_DAYS KV TTL in days (default 365)

interface Env {
  CONSENT_LOG?: KVNamespace;
  TURNSTILE_SECRET?: string;
  CONSENT_IP_SALT?: string;
  CONSENT_RETENTION_DAYS?: string;
}

interface ConsentBody {
  categories?: string[];
  version?: string;
  token?: string; // Turnstile response, when enabled
}

const json = (data: unknown, status = 200): Response =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

async function verifyTurnstile(secret: string, token: string, ip: string | null): Promise<boolean> {
  const body = new FormData();
  body.append("secret", secret);
  body.append("response", token);
  if (ip) body.append("remoteip", ip);
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
  });
  const out = (await res.json()) as { success: boolean };
  return out.success === true;
}

async function hashIP(ip: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(salt + ip);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let payload: ConsentBody;
  try {
    payload = (await request.json()) as ConsentBody;
  } catch {
    return json({ error: "invalid JSON" }, 400);
  }

  // Bound the input: this endpoint is unauthenticated by default (Turnstile is
  // opt-in), so cap the number and length of categories to keep a single write
  // small regardless of what a client posts.
  const categories = (Array.isArray(payload.categories) ? payload.categories : [])
    .slice(0, 20)
    .map((c) => String(c).slice(0, 40));
  const version = (typeof payload.version === "string" ? payload.version : "1").slice(0, 40);

  // Turnstile is opt-in: only enforced when a secret is configured, and a
  // failure never rejects the consent — it only skips the audit write, so a
  // legally-required choice is never gated behind a challenge.
  let verified = true;
  if (env.TURNSTILE_SECRET) {
    const ip = request.headers.get("cf-connecting-ip");
    verified = !!payload.token && (await verifyTurnstile(env.TURNSTILE_SECRET, payload.token, ip));
  }

  if (env.CONSENT_LOG && verified) {
    const ip = request.headers.get("cf-connecting-ip") || "";
    const record = {
      ts: new Date().toISOString(),
      country: (request.cf?.country as string) || "",
      categories,
      version,
      // Store the IP hash only when a salt is set: an unsalted sha256(ip) over
      // the 2^32 IPv4 space is precomputable (reversible), defeating the "only a
      // salted hash is kept" guarantee. No salt → store nothing.
      ipHash: ip && env.CONSENT_IP_SALT ? await hashIP(ip, env.CONSENT_IP_SALT) : "",
      ua: request.headers.get("user-agent") || "",
    };
    const days = Number(env.CONSENT_RETENTION_DAYS) || 365;
    const key = `${record.ts}-${crypto.randomUUID()}`;
    await env.CONSENT_LOG.put(key, JSON.stringify(record), {
      expirationTtl: days * 24 * 60 * 60,
    });
  }

  // Always acknowledge: the client has already stored the choice locally.
  return json({ ok: true, stored: !!env.CONSENT_LOG && verified });
};
