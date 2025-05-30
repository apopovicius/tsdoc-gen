import { describe, it, expect } from "vitest";
import { Project } from "ts-morph";
import { VariableHandler } from "./variable";
import type { TSDocGeneratorOptions } from "../config";

describe("VariableHandler", () => {
  const handler = new VariableHandler();

  const defaultOptions: TSDocGeneratorOptions = {
    includeReturnsForVoid: true,
    includeEmptyParamBlock: true,
  };

  function getVariableNode(code: string, name: string) {
    const project = new Project({ useInMemoryFileSystem: true });
    const source = project.createSourceFile("test.ts", code, {
      overwrite: true,
    });
    return source.getVariableDeclarationOrThrow(name);
  }

  it("canHandle() should detect variable declarations", () => {
    const node = getVariableNode("const count: number = 1;", "count");
    expect(handler.canHandle(node)).toBe(true);
  });

  it("generate() should include name and type in the TSDoc", () => {
    const node = getVariableNode("const name: string = 'test';", "name");
    const doc = handler.generate(node, defaultOptions);

    expect(doc).toContain("TODO: Describe the name variable.");
    expect(doc).toContain("@type {string}");
  });

  it("should support inferred types", () => {
    const node = getVariableNode("const active = true;", "active");
    const doc = handler.generate(node, defaultOptions);

    expect(doc).toContain("TODO: Describe the active variable.");
    expect(doc).toContain("@type {boolean}");
  });

  it("should support object types", () => {
    const node = getVariableNode(
      "const config: Record<string, any> = {};",
      "config"
    );
    const doc = handler.generate(node, defaultOptions);

    expect(doc).toContain("@type {Record<string, any>}");
  });

  it("should fallback gracefully with missing type info", () => {
    const node = getVariableNode("let temp;", "temp");
    const doc = handler.generate(node, defaultOptions);

    expect(doc).toContain("TODO: Describe the temp variable.");
    expect(doc).toContain("@type {any}");
  });
});
