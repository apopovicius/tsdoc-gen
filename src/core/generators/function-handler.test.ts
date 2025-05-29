import { Project } from "ts-morph";
import { expect, it, describe } from "vitest";
import { FunctionHandler } from ".";

describe("FunctionHandler", () => {
  const handler = new FunctionHandler();

  it("should handle function declarations", () => {
    const project = new Project({ useInMemoryFileSystem: true });
    const source = project.createSourceFile(
      "test.ts",
      "function greet(name: string): string {}"
    );
    const fn = source.getFunction("greet");
    expect(fn && handler.canHandle(fn)).toBe(true);
  });

  it("should generate TSDoc for a function", () => {
    const project = new Project({ useInMemoryFileSystem: true });
    const source = project.createSourceFile(
      "test.ts",
      "function greet(name: string): string {}"
    );
    const fn = source.getFunction("greet");
    const doc = fn ? handler.generate(fn) : "";
    expect(doc).toContain("@param name");
    expect(doc).toContain("@returns string");
  });
});
