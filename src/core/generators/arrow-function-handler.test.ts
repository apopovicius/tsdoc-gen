import { Project } from "ts-morph";
import { ArrowFunctionHandler } from ".";

import { expect, it, describe } from "vitest";

describe("ArrowFunctionHandler", () => {
  const handler = new ArrowFunctionHandler();

  it("should handle arrow functions", () => {
    const project = new Project({ useInMemoryFileSystem: true });
    const src = project.createSourceFile(
      "test.ts",
      "const greet = (name: string): string => `Hi ${name}`;"
    );
    const decl = src.getVariableDeclaration("greet");
    expect(decl && handler.canHandle(decl)).toBe(true);
  });

  it("should generate TSDoc for an arrow function", () => {
    const project = new Project({ useInMemoryFileSystem: true });
    const src = project.createSourceFile(
      "test.ts",
      "const greet = (name: string): string => `Hi ${name}`;"
    );
    const decl = src.getVariableDeclaration("greet");
    const doc = decl ? handler.generate(decl) : "";
    expect(doc).toContain("@param name");
    expect(doc).toContain("@returns string");
  });
});
