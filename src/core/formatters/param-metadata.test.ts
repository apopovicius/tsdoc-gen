import { describe, it, expect } from "vitest";
import { Project } from "ts-morph";
import { extractParamMetadata } from "./param-metadata";

describe("extractParamMetadata", () => {
  it("should extract parameter names and types", () => {
    const code = `function greet(name: string, age: number) {}`;
    const project = new Project({ useInMemoryFileSystem: true });
    const sourceFile = project.createSourceFile("test.ts", code, {
      overwrite: true,
    });

    const fn = sourceFile.getFunction("greet");
    expect(fn).toBeDefined();

    const params = fn!.getParameters();
    const metadata = extractParamMetadata(params);

    expect(metadata).toEqual([
      ["name", "string"],
      ["age", "number"],
    ]);
  });
});
