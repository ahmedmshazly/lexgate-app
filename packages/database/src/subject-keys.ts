import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";

/**
 * Per-subject encryption, so that erasure can be performed by destroying a key
 * rather than a record. ADR-010 forbids destructive updates; shredding the key
 * leaves every row and every append-only guarantee intact while making the
 * personal data permanently unreadable.
 *
 * IMPORTANT LIMITATION: the key is stored in the same database as the
 * ciphertext. Anyone with database access holds both halves, so this is an
 * ERASURE mechanism, not a confidentiality control. Real crypto-shredding
 * places keys in a separate managed store, which depends on ODR-005 and is
 * open. Do not present this as encryption at rest.
 */

/** Marker returned in place of a value whose key has been shredded. */
export const ERASED_VALUE = "[ERASED]";

const ALGORITHM = "aes-256-gcm";
const KEY_BYTES = 32;
const IV_BYTES = 12;

export const createSubjectKey = (): string =>
  randomBytes(KEY_BYTES).toString("base64");

/**
 * Encrypts a value under a subject key, with a fresh IV every time.
 *
 * The fresh IV matters beyond convention here: identical plaintexts must not
 * produce identical ciphertext, or two parties sharing a name would be
 * visibly linked in storage — leaking exactly the duplicate relationship the
 * system is designed never to assert on its own.
 */
export const encryptValue = (
  plaintext: string,
  keyMaterial: string,
): string => {
  const key = Buffer.from(keyMaterial, "base64");
  const iv = randomBytes(IV_BYTES);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);

  return [
    iv.toString("base64"),
    cipher.getAuthTag().toString("base64"),
    ciphertext.toString("base64"),
  ].join(".");
};

export class SubjectValueDecryptionError extends Error {
  override name = "SubjectValueDecryptionError";
}

/**
 * Decrypts a stored envelope. A null key means the subject was erased, which
 * is an expected state rather than a failure: the caller receives the erased
 * marker so an erased record stays navigable.
 */
export const decryptValue = (
  envelope: string,
  keyMaterial: string | null,
): string => {
  if (keyMaterial === null) return ERASED_VALUE;

  const [iv, authTag, ciphertext] = envelope.split(".");
  if (!iv || !authTag || !ciphertext) {
    throw new SubjectValueDecryptionError(
      "A stored value is not a well-formed encrypted envelope.",
    );
  }

  const decipher = createDecipheriv(
    ALGORITHM,
    Buffer.from(keyMaterial, "base64"),
    Buffer.from(iv, "base64"),
  );
  decipher.setAuthTag(Buffer.from(authTag, "base64"));

  return Buffer.concat([
    decipher.update(Buffer.from(ciphertext, "base64")),
    decipher.final(),
  ]).toString("utf8");
};

/** True when two envelopes hold the same ciphertext, without leaking timing. */
export const envelopesMatch = (left: string, right: string): boolean => {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
};
