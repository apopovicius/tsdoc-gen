import { Project, SyntaxKind } from "ts-morph";

import { beforeAll, describe, expect, it } from "vitest";
import {
  collectMultilineDeclarations,
  DeclarationMeta,
} from "./multiline-handler";

describe("multilineHandler - collectMultilineDeclarations", () => {
  const project = new Project({
    useInMemoryFileSystem: true,
    skipAddingFilesFromTsConfig: true,
  });

  const sourceText = `
    export async function multiLineFunc(
      param1: string,
      param2: number
    ): Promise<void> {}

    class MyClass<T> extends BaseClass {
      constructor() {}
      
      doWork(): void {}
    }

    const arrowFunc = (
      a: number,
      b: number
    ) => a + b;

    class Another {
      myProp: string = "value";
    }
  `;

  const sourceFile = project.createSourceFile("test.ts", sourceText, {
    overwrite: true,
  });

  let declarations: DeclarationMeta[];

  beforeAll(() => {
    declarations = collectMultilineDeclarations(sourceFile);
  });

  it("should detect a multiline function declaration", () => {
    const fn = declarations.find((d) => d.kind === "function");
    expect(fn).toBeDefined();
    expect(fn?.node.getText()).toContain("multiLineFunc");
  });

  it("should detect a class declaration", () => {
    const cls = declarations.find(
      (d) => d.kind === "class" && d.node.getText().includes("MyClass")
    );
    expect(cls).toBeDefined();
  });

  it("should detect a method inside a class", () => {
    const method = declarations.find(
      (d) => d.kind === "method" && d.node.getText().includes("doWork")
    );
    expect(method).toBeDefined();
  });

  it("should detect an arrow function", () => {
    const arrow = declarations.find((d) => d.kind === "arrow-function");
    expect(arrow).toBeDefined();

    const variableName = arrow?.node
      .getFirstAncestorByKind(SyntaxKind.VariableDeclaration)
      ?.getName();
    expect(variableName).toBe("arrowFunc");
  });

  it("should detect a property declaration", () => {
    const prop = declarations.find(
      (d) => d.kind === "property" && d.node.getText().includes("myProp")
    );
    expect(prop).toBeDefined();
  });
});
