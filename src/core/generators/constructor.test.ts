import { describe, expect, it } from "vitest";
import { ConstructorHandler } from ".";
import { Project, SyntaxKind } from "ts-morph";

describe("ConstructorHandler", () => {
  const handler = new ConstructorHandler();

  it("should match constructor nodes", () => {
    const project = new Project({ useInMemoryFileSystem: true });
    const source = project.createSourceFile(
      "Test.ts",
      `
      class MyClass {
        constructor(name: string, age: number) {}
      }
    `
    );

    const ctor = source.getDescendantsOfKind(SyntaxKind.Constructor)[0];
    expect(handler.canHandle(ctor)).toBe(true);
  });

  it("should generate TSDoc for constructor with params", () => {
    const project = new Project({ useInMemoryFileSystem: true });
    const source = project.createSourceFile(
      "Test.ts",
      `
      class MyClass {
        constructor(name: string, age: number) {}
      }
    `
    );

    const ctor = source.getDescendantsOfKind(SyntaxKind.Constructor)[0];
    const output = handler.generate(ctor);

    expect(output).toContain("Creates an instance of the class.");
    expect(output).toContain("@param name - {string}");
    expect(output).toContain("@param age - {number}");
  });

  it("should omit param block when no params and option disabled", () => {
    const project = new Project({ useInMemoryFileSystem: true });
    const source = project.createSourceFile(
      "Test.ts",
      `
      class MyClass {
        constructor() {}
      }
    `
    );

    const ctor = source.getDescendantsOfKind(SyntaxKind.Constructor)[0];
    const output = handler.generate(ctor, { includeEmptyParamBlock: false });

    expect(output).toContain("Creates an instance of the class.");
    expect(output).not.toContain("@param");
  });

  it("should include param block even when empty if option enabled", () => {
    const project = new Project({ useInMemoryFileSystem: true });
    const source = project.createSourceFile(
      "Test.ts",
      `
      class MyClass {
        constructor() {}
      }
    `
    );

    const ctor = source.getDescendantsOfKind(SyntaxKind.Constructor)[0];
    const output = handler.generate(ctor, { includeEmptyParamBlock: true });

    expect(output).toContain("Creates an instance of the class.");
    expect(output).toContain("@param");
  });
});
