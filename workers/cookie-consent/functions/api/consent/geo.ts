// Cloudflare Pages Function: consent geo check.
// GET /api/consent/geo — tells the client whether a consent banner is legally
// required for this visitor, based on the edge-resolved country. The banner is
// shown in the EEA and the UK by default (GDPR + ePrivacy / UK GDPR + PECR);
// override the set, or force it on everywhere, with the env vars below.
//
// The client calls this once on load. It is deliberately tiny and cached
// no-store, so the decision always reflects the current visitor's country.
//
// Config (wrangler pages secret put / [vars] in wrangler.toml, all optional):
//   CONSENT_ALWAYS      "1" => the banner is required for every visitor
//   CONSENT_COUNTRIES   comma-separated ISO codes to require it in, replacing
//                       the EEA+UK default (e.g. "DE,FR,PL,GB")

interface Env {
  CONSENT_ALWAYS?: string;
  CONSENT_COUNTRIES?: string;
}

// EEA (EU 27 + Iceland, Liechtenstein, Norway) plus the United Kingdom — the
// jurisdictions whose prior-consent rules a static site most often has to meet.
const EEA_UK: ReadonlySet<string> = new Set([
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR",
  "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK",
  "SI", "ES", "SE", "IS", "LI", "NO", "GB",
]);

const json = (data: unknown, status = 200): Response =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const country = (request.cf?.country as string) || "";

  let required: boolean;
  if (env.CONSENT_ALWAYS === "1") {
    required = true;
  } else if (env.CONSENT_COUNTRIES) {
    const set = new Set(
      env.CONSENT_COUNTRIES.split(",").map((c) => c.trim().toUpperCase()).filter(Boolean),
    );
    required = set.has(country);
  } else {
    required = EEA_UK.has(country);
  }

  return json({ country, required });
};
