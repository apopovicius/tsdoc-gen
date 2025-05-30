import { Project } from "ts-morph";
import { describe, it, expect } from "vitest";
import { FunctionHandler } from "./function";
import { TSDocGeneratorOptions } from "../config";

describe("FunctionHandler", () => {
  const handler = new FunctionHandler();
  const options: TSDocGeneratorOptions = {
    includeReturnsForVoid: true,
    includeEmptyParamBlock: true,
  };

  it("canHandle() should return true for function declarations", () => {
    const project = new Project({ useInMemoryFileSystem: true });
    const source = project.createSourceFile(
      "test.ts",
      "function greet(name: string): string {}",
      { overwrite: true }
    );

    const fn = source.getFunctionOrThrow("greet");
    expect(handler.canHandle(fn)).toBe(true);
  });

  it("generate() should include @param and @returns tags", () => {
    const project = new Project({ useInMemoryFileSystem: true });
    const source = project.createSourceFile(
      "test.ts",
      "function greet(name: string): string {}",
      { overwrite: true }
    );

    const fn = source.getFunctionOrThrow("greet");
    const doc = handler.generate(fn, options);

    expect(doc).toContain("@param name");
    expect(doc).toContain("@returns string");
  });

  it("generate() should include empty @param block when enabled", () => {
    const project = new Project({ useInMemoryFileSystem: true });
    const source = project.createSourceFile(
      "test.ts",
      "function empty(): void {}",
      { overwrite: true }
    );

    const fn = source.getFunctionOrThrow("empty");
    const doc = handler.generate(fn, {
      includeReturnsForVoid: false,
      includeEmptyParamBlock: true,
    });

    expect(doc).toContain("@param");
  });

  it("generate() should omit @returns for void when disabled", () => {
    const project = new Project({ useInMemoryFileSystem: true });
    const source = project.createSourceFile(
      "test.ts",
      "function log(): void {}",
      { overwrite: true }
    );

    const fn = source.getFunctionOrThrow("log");
    const doc = handler.generate(fn, {
      includeReturnsForVoid: false,
      includeEmptyParamBlock: false,
    });

    expect(doc).not.toContain("@returns");
  });
});
