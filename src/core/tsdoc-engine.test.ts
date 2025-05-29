import { generateTSDoc } from "./tsdoc-engine";
import { expect, it, describe } from "vitest";

describe("generateTSDoc (integration)", () => {
  it("should generate doc for a function", () => {
    const result = generateTSDoc(
      "function add(a: number, b: number): number {"
    );
    expect(result).toContain("@param a");
    expect(result).toContain("@returns number");
  });

  it("should generate doc for a class method", () => {
    const result = generateTSDoc("greet(name: string): string {");
    expect(result).toContain("@param name");
    expect(result).toContain("@returns string");
  });

  it("should generate fallback doc for unsupported input", () => {
    const result = generateTSDoc("export const value = 123;");
    expect(result).toContain("TODO: Add documentation");
  });
});
