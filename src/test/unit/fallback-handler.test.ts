import { FallbackHandler } from "../../core/generators";
import { expect, it, describe } from "vitest";

describe("FallbackHandler", () => {
  it("should always handle any node", () => {
    const handler = new FallbackHandler();
    expect(handler.canHandle({} as any)).toBe(true);
  });

  it("should return fallback doc string", () => {
    const handler = new FallbackHandler();
    const result = handler.generate({} as any);
    expect(result).toContain("TODO: Add documentation");
  });
});
