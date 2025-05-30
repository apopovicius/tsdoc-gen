import { describe, it, expect } from "vitest";
import { Project } from "ts-morph";
import { PropertyHandler } from "./property";
import { TSDocGeneratorOptions } from "../config";

describe("PropertyHandler", () => {
  const handler = new PropertyHandler();

  const defaultOptions: TSDocGeneratorOptions = {
    includeReturnsForVoid: true,
    includeEmptyParamBlock: true,
  };

  it("canHandle() should detect property declarations", () => {
    const project = new Project({ useInMemoryFileSystem: true });
    const src = project.createSourceFile(
      "test.ts",
      `
        class Example {
          count: number;
        }
      `,
      { overwrite: true }
    );

    const prop = src.getClassOrThrow("Example").getPropertyOrThrow("count");
    expect(handler.canHandle(prop)).toBe(true);
  });

  it("generate() should include the property name and type", () => {
    const project = new Project({ useInMemoryFileSystem: true });
    const src = project.createSourceFile(
      "test.ts",
      `
        class Person {
          name: string;
        }
      `,
      { overwrite: true }
    );

    const prop = src.getClassOrThrow("Person").getPropertyOrThrow("name");
    const doc = handler.generate(prop, defaultOptions);

    expect(doc).toContain("TODO: Describe the name property.");
    expect(doc).toContain("@type {string}");
  });

  it("generate() should support complex property types", () => {
    const project = new Project({ useInMemoryFileSystem: true });
    const src = project.createSourceFile(
      "test.ts",
      `
        class Config {
          options: Record<string, any>;
        }
      `,
      { overwrite: true }
    );

    const prop = src.getClassOrThrow("Config").getPropertyOrThrow("options");
    const doc = handler.generate(prop, defaultOptions);

    expect(doc).toContain("@type {Record<string, any>}");
  });

  it("generate() should fallback to default comment structure for unnamed class", () => {
    const project = new Project({ useInMemoryFileSystem: true });
    const src = project.createSourceFile(
      "test.ts",
      `
        export default class {
          hidden: boolean;
        }
      `,
      { overwrite: true }
    );

    const prop = src.getClasses()[0].getPropertyOrThrow("hidden");
    const doc = handler.generate(prop, defaultOptions);

    expect(doc).toContain("TODO: Describe the hidden property.");
    expect(doc).toContain("@type {boolean}");
  });
});
