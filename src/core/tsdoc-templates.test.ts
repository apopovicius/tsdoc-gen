import { describe, it, expect } from "vitest";
import { tsdocTemplates } from "./tsdoc-templates";

describe("tsdocTemplates", () => {
  it("generateForFunction() should include params and returns when enabled", () => {
    const result = tsdocTemplates.generateForFunction({
      name: "add",
      params: [
        ["a", "number"],
        ["b", "number"],
      ],
      returnType: "number",
      includeParams: true,
      includeReturns: true,
    });

    expect(result).toContain("@param a");
    expect(result).toContain("@param b");
    expect(result).toContain("@returns number");
  });

  it("generateForFunction() should omit params and returns when disabled", () => {
    const result = tsdocTemplates.generateForFunction({
      name: "noop",
      params: [],
      returnType: "void",
      includeParams: false,
      includeReturns: false,
    });

    expect(result).not.toContain("@param");
    expect(result).not.toContain("@returns");
  });

  it("generateForMethod() should render correctly", () => {
    const result = tsdocTemplates.generateForMethod({
      name: "greet",
      params: [["name", "string"]],
      returnType: "string",
      includeParams: true,
      includeReturns: true,
    });

    expect(result).toContain("Describe the greet method");
    expect(result).toContain("@param name");
    expect(result).toContain("@returns string");
  });

  it("generateForArrowFunction() should handle named arrow functions", () => {
    const result = tsdocTemplates.generateForArrowFunction({
      name: "sum",
      params: [["x", "number"]],
      returnType: "number",
      includeParams: true,
      includeReturns: true,
    });

    expect(result).toContain("arrow function (sum)");
    expect(result).toContain("@param x");
    expect(result).toContain("@returns number");
  });

  it("generateForArrowFunction() should handle anonymous arrow functions", () => {
    const result = tsdocTemplates.generateForArrowFunction({
      name: undefined,
      params: [["x", "number"]],
      returnType: "number",
      includeParams: true,
      includeReturns: true,
    });

    expect(result).toContain("arrow function");
    expect(result).not.toContain("arrow function (undefined)");
  });

  it("generateForClass() should include class name", () => {
    const result = tsdocTemplates.generateForClass({ name: "Service" });
    expect(result).toContain("Describe the Service class");
  });

  it("generateForProperty() should include property name and type", () => {
    const result = tsdocTemplates.generateForProperty({
      name: "count",
      type: "number",
      defaultValue: "0",
    });

    expect(result).toContain("Describe the count property");
    expect(result).toContain("@type {number}");
  });

  it("generateForVariable() should include variable name and type", () => {
    const result = tsdocTemplates.generateForVariable({
      name: "isActive",
      type: "boolean",
    });

    expect(result).toContain("Describe the isActive variable");
    expect(result).toContain("@type {boolean}");
  });

  it("generateFallback() should return generic fallback comment", () => {
    const result = tsdocTemplates.generateFallback();
    expect(result).toContain("TODO: Add documentation");
  });
});
