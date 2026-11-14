# Publishing to Maven Central

The release workflow (`.github/workflows/release-packages.yml`, job *Release Java
Package*) publishes `org.schema-resume:schema-resume-validator` to Maven Central
through the Central Portal, as soon as the four secrets below exist. Until then it
only builds and tests, so a release is never blocked on this setup.

## 1. Namespace (once)

1. Sign in at <https://central.sonatype.com> → **View Namespaces** → **Register New
   Namespace**.
2. Enter **`org.schema-resume`**: the `groupId` in `pom.xml`, which is the domain
   `schema-resume.org` reversed.
3. The portal shows a **verification key**. Add it to the DNS of `schema-resume.org`
   as a TXT record on the apex (`@`), content = the key exactly as shown.
4. Click **Verify Namespace**. DNS usually propagates in minutes; the TXT record can
   be removed once the namespace shows *Verified*.

## 2. Portal token (once)

**View Account** → **Generate User Token**. It gives a username and a password; they
are not your login. Store them as repository secrets:

| Secret | Value |
| --- | --- |
| `MAVEN_CENTRAL_USERNAME` | token username |
| `MAVEN_CENTRAL_TOKEN` | token password |

## 3. Signing key (once)

Central rejects unsigned artifacts, and checks the signature against a public
keyserver.

```bash
gpg --quick-generate-key "Schema Resume <info@schema-resume.org>" ed25519 sign 3y
gpg --list-secret-keys --keyid-format long          # note the key id
gpg --keyserver keys.openpgp.org --send-keys <KEY_ID>
gpg --armor --export-secret-keys <KEY_ID>           # paste into the secret below
```

keys.openpgp.org e-mails info@schema-resume.org a link to publish the address with
the key; confirm it.

| Secret | Value |
| --- | --- |
| `MAVEN_GPG_PRIVATE_KEY` | the armored private key, including the BEGIN/END lines |
| `MAVEN_GPG_PASSPHRASE` | its passphrase |

```bash
gh secret set MAVEN_CENTRAL_USERNAME
gh secret set MAVEN_CENTRAL_TOKEN
gh secret set MAVEN_GPG_PASSPHRASE
gpg --armor --export-secret-keys <KEY_ID> | gh secret set MAVEN_GPG_PRIVATE_KEY
```

## 4. What a release does

```bash
mvn -B clean verify                       # tests + JaCoCo gate (98% lines)
mvn -B -P release -DskipTests deploy      # sources, javadoc, GPG signatures, upload
```

The `release` profile in `pom.xml` adds the sources and javadoc jars, signs every
artifact and uploads them with `central-publishing-maven-plugin`, which waits until
Central reports the version *published*. Maven Central versions are immutable: a
version that was published cannot be uploaded again, so a failed release is fixed
with the next version, not a re-run of the same one.

## Checking a local build of the release profile

```bash
cd packages/java
mvn -B -P release -Dgpg.skip clean verify   # builds all three jars, signs nothing
```
