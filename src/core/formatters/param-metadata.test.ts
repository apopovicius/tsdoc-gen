import { expect, it, describe } from "vitest";
import { Project } from "ts-morph";
import { extractParamMetadata } from "./param-metadata";

describe("extractParamMetadata", () => {
  it("should extract parameter names and types", () => {
    const project = new Project({ useInMemoryFileSystem: true });
    const sourceFile = project.createSourceFile(
      "test.ts",
      "function greet(name: string, age: number) {}"
    );
    const fn = sourceFile.getFunction("greet");
    const params = fn?.getParameters() ?? [];

    const metadata = extractParamMetadata(params);

    expect(metadata).toEqual([
      ["name", "string"],
      ["age", "number"],
    ]);
  });
});
