import { Project } from "ts-morph";
import { describe, it, expect } from "vitest";
import { TSDocGeneratorOptions } from "../config";
import { MethodHandler } from "./method";

describe("MethodHandler", () => {
  const handler = new MethodHandler();
  const defaultOptions: TSDocGeneratorOptions = {
    includeReturnsForVoid: true,
    includeEmptyParamBlock: true,
  };

  it("canHandle() should detect method declarations", () => {
    const project = new Project({ useInMemoryFileSystem: true });
    const src = project.createSourceFile(
      "test.ts",
      'class Greeter { greet(name: string): string { return ""; } }',
      { overwrite: true }
    );

    const method = src.getClassOrThrow("Greeter").getMethodOrThrow("greet");
    expect(handler.canHandle(method)).toBe(true);
  });

  it("generate() should include @param and @returns tags", () => {
    const project = new Project({ useInMemoryFileSystem: true });
    const src = project.createSourceFile(
      "test.ts",
      'class Greeter { greet(name: string): string { return ""; } }',
      { overwrite: true }
    );

    const method = src.getClassOrThrow("Greeter").getMethodOrThrow("greet");
    const doc = handler.generate(method, defaultOptions);

    expect(doc).toContain("@param name");
    expect(doc).toContain("@returns string");
  });

  it("generate() should include empty @param block when enabled", () => {
    const project = new Project({ useInMemoryFileSystem: true });
    const src = project.createSourceFile(
      "test.ts",
      "class Logger { log(): void {} }",
      { overwrite: true }
    );

    const method = src.getClassOrThrow("Logger").getMethodOrThrow("log");
    const doc = handler.generate(method, {
      includeReturnsForVoid: false,
      includeEmptyParamBlock: true,
    });

    expect(doc).toContain("@param");
  });

  it("generate() should omit @returns for void if disabled", () => {
    const project = new Project({ useInMemoryFileSystem: true });
    const src = project.createSourceFile(
      "test.ts",
      "class Logger { log(): void {} }",
      { overwrite: true }
    );

    const method = src.getClassOrThrow("Logger").getMethodOrThrow("log");
    const doc = handler.generate(method, {
      includeReturnsForVoid: false,
      includeEmptyParamBlock: false,
    });

    expect(doc).not.toContain("@returns");
  });
});
