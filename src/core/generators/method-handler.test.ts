import { Project } from "ts-morph";
import { expect, it, describe } from "vitest";
import { MethodHandler } from ".";

describe("MethodHandler", () => {
  const handler = new MethodHandler();

  it("should handle class methods", () => {
    const project = new Project({ useInMemoryFileSystem: true });
    const src = project.createSourceFile(
      "test.ts",
      'class Greeter { greet(name: string): string { return ""; } }'
    );
    const method = src.getClass("Greeter")?.getMethod("greet");
    expect(method && handler.canHandle(method)).toBe(true);
  });

  it("should generate TSDoc for a method", () => {
    const project = new Project({ useInMemoryFileSystem: true });
    const src = project.createSourceFile(
      "test.ts",
      'class Greeter { greet(name: string): string { return ""; } }'
    );
    const method = src.getClass("Greeter")?.getMethod("greet");
    const doc = method ? handler.generate(method) : "";
    expect(doc).toContain("@param name");
    expect(doc).toContain("@returns string");
  });
});
