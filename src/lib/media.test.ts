import { describe, expect, it } from "vitest";
import { formatStorageError } from "./media";

describe("formatStorageError", () => {
  it("returns a helpful message when the storage bucket is missing", () => {
    const result = formatStorageError({
      message: "Bucket not found",
      code: "PGRST301",
      statusCode: 404,
    });

    expect(result).toContain("farmer-media");
    expect(result).toContain("Create the bucket in the Supabase dashboard");
  });

  it("keeps the original message for unrelated storage failures", () => {
    const result = formatStorageError({ message: "Unexpected upload issue" });
    expect(result).toBe("Unexpected upload issue");
  });
});
