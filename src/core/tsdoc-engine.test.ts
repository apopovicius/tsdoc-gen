import { describe, it, expect } from "vitest";
import { Project } from "ts-morph";

import { collectMultilineDeclarations } from "./generators/multiline";
import type { DeclarationMeta } from "./generators";
import { createTSDocCommentFor } from "./tsdoc-engine";

const defaultOptions = {
  includeReturnsForVoid: true,
  includeEmptyParamBlock: true,
};

/**
 * Resolves the first declaration found in the code.
 * Useful for basic function/class tests.
 */
function resolveTestDeclaration(code: string): DeclarationMeta | undefined {
  const project = new Project({ useInMemoryFileSystem: true });
  const sourceFile = project.createSourceFile("test.ts", code, {
    overwrite: true,
  });

  const declarations = collectMultilineDeclarations(sourceFile);
  return declarations[0];
}

describe("createTSDocCommentFor (integration)", () => {
  it("generates TSDoc for a simple function", () => {
    const code = `function add(a: number, b: number): number {}`;
    const declaration = resolveTestDeclaration(code);
    expect(declaration).toBeDefined();

    const result = createTSDocCommentFor(declaration!, defaultOptions);
    expect(result).toContain("@param a");
    expect(result).toContain("@param b");
    expect(result).toContain("@returns number");
  });

  it("generates TSDoc for a class method", () => {
    const code = `
      class Greeter {
        greet(name: string): string {
          return "Hello " + name;
        }
      }
    `;

    const project = new Project({ useInMemoryFileSystem: true });
    const source = project.createSourceFile("test.ts", code, {
      overwrite: true,
    });
    const method = source.getClassOrThrow("Greeter").getMethodOrThrow("greet");

    const declaration: DeclarationMeta = {
      node: method,
      kind: "method",
    };

    const result = createTSDocCommentFor(declaration, defaultOptions);
    expect(result).toContain("@param name");
    expect(result).toContain("@returns string");
  });

  it("generates TSDoc for a class declaration", () => {
    const code = `
      class MyService {
        doWork() {}
      }
    `;
    const declaration = resolveTestDeclaration(code);
    expect(declaration).toBeDefined();

    const result = createTSDocCommentFor(declaration!, defaultOptions);
    expect(result).toContain("TODO: Describe the MyService class");
  });

  it("generates TSDoc for a multiline function", () => {
    const code = `
      function multiply(
        a: number,
        b: number
      ): number {
        return a * b;
      }
    `;
    const declaration = resolveTestDeclaration(code);
    expect(declaration).toBeDefined();

    const result = createTSDocCommentFor(declaration!, defaultOptions);
    expect(result).toContain("@param a");
    expect(result).toContain("@param b");
    expect(result).toContain("@returns number");
  });

  it("generates fallback TSDoc for unsupported declaration", () => {
    const declaration: DeclarationMeta = {
      node: {} as any,
      kind: "unknown" as any,
    };

    const result = createTSDocCommentFor(declaration, defaultOptions);
    expect(result).toContain("TODO: Add documentation");
  });
});
