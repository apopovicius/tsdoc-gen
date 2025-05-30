import { describe, it, expect } from "vitest";
import { Project } from "ts-morph";
import { ClassHandler } from "./class";

describe("ClassHandler", () => {
  const handler = new ClassHandler();

  it("canHandle() should detect class declarations", () => {
    const project = new Project({ useInMemoryFileSystem: true });
    const source = project.createSourceFile("test.ts", "class MyClass {}", {
      overwrite: true,
    });
    const node = source.getClassOrThrow("MyClass");

    expect(handler.canHandle(node)).toBe(true);
  });

  it("generate() should create a TSDoc comment for a named class", () => {
    const project = new Project({ useInMemoryFileSystem: true });
    const source = project.createSourceFile("test.ts", "class MyService {}", {
      overwrite: true,
    });
    const node = source.getClassOrThrow("MyService");

    const result = handler.generate(node);
    expect(result).toContain("TODO: Describe the MyService class");
  });

  it("generate() should fallback to 'Class' when name is missing", () => {
    const project = new Project({ useInMemoryFileSystem: true });
    const source = project.createSourceFile(
      "test.ts",
      "export default class {}",
      { overwrite: true }
    );
    const cls = source.getClasses()[0];

    const result = handler.generate(cls);
    expect(result).toContain("TODO: Describe the Class class");
  });
});
