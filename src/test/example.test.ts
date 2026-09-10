import { describe, it, expect } from "vitest";
import { hasSupabaseConfig } from "@/integrations/supabase/client";

describe("example", () => {
  it("should pass", () => {
    expect(true).toBe(true);
  });

  it("does not require Supabase environment variables at startup", () => {
    expect(hasSupabaseConfig).toBe(false);
  });
});
