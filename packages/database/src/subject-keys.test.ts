import { describe, expect, it } from "vitest";
import {
  createSubjectKey,
  decryptValue,
  encryptValue,
  ERASED_VALUE,
  SubjectValueDecryptionError,
} from "./subject-keys.js";

describe("subject key encryption (FR-006, FR-009)", () => {
  it("returns the original value through a round trip", () => {
    const key = createSubjectKey();

    for (const plaintext of ["أحمد اختبار", "Ahmed Ekhtibar", "synthetic"]) {
      expect(decryptValue(encryptValue(plaintext, key), key)).toBe(plaintext);
    }
  });

  it("produces different ciphertext for identical plaintext", () => {
    // Two parties sharing a name must not be visibly linked in storage. That
    // would leak precisely the duplicate relationship the system is designed
    // never to assert on its own.
    const key = createSubjectKey();
    const first = encryptValue("أحمد اختبار", key);
    const second = encryptValue("أحمد اختبار", key);

    expect(first).not.toBe(second);
    expect(decryptValue(first, key)).toBe(decryptValue(second, key));
  });

  it("stores no readable trace of the plaintext", () => {
    const envelope = encryptValue("Ahmed Ekhtibar", createSubjectKey());

    expect(envelope).not.toContain("Ahmed");
    expect(envelope).not.toContain("Ekhtibar");
  });

  it("returns the erased marker rather than failing once the key is gone", () => {
    const envelope = encryptValue("Ahmed Ekhtibar", createSubjectKey());

    // An erased record must stay navigable: who did what and when survives,
    // only the content is gone.
    expect(decryptValue(envelope, null)).toBe(ERASED_VALUE);
  });

  it("cannot be read with a different subject's key", () => {
    const envelope = encryptValue("Ahmed Ekhtibar", createSubjectKey());

    expect(() => decryptValue(envelope, createSubjectKey())).toThrow();
  });

  it("detects a tampered envelope rather than returning wrong plaintext", () => {
    const key = createSubjectKey();
    const parts = encryptValue("synthetic", key).split(".");
    const [iv, authTag, ciphertext] = parts as [string, string, string];
    const flipped = Buffer.from(ciphertext, "base64");
    flipped[0] = (flipped[0] ?? 0) ^ 0xff;

    expect(() =>
      decryptValue([iv, authTag, flipped.toString("base64")].join("."), key),
    ).toThrow();
  });

  it("rejects a malformed envelope explicitly", () => {
    expect(() => decryptValue("not-an-envelope", createSubjectKey())).toThrow(
      SubjectValueDecryptionError,
    );
  });
});
