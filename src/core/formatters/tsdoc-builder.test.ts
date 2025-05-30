import { describe, it, expect } from "vitest";
import { TSDocBuilder } from "./tsdoc-builder";

describe("TSDocBuilder", () => {
  it("should generate a basic comment block", () => {
    const result = new TSDocBuilder()
      .open()
      .addLine("Hello")
      .addLine("World")
      .close()
      .toString();

    expect(result).toMatchInlineSnapshot(`
      "/**\n * Hello\n * World\n */"
    `);
  });

  it("should support addParam and addReturns", () => {
    const result = new TSDocBuilder()
      .open()
      .addLine("Example function")
      .addParam("x", "number")
      .addReturns("string")
      .close()
      .toString();

    expect(result).toContain("@param x - {number}");
    expect(result).toContain("@returns string");
  });

  it("should support addParams with multiple entries", () => {
    const result = new TSDocBuilder()
      .open()
      .addParams([
        ["a", "string"],
        ["b", "number"],
      ])
      .close()
      .toString();

    expect(result).toContain("@param a - {string}");
    expect(result).toContain("@param b - {number}");
  });

  it("should omit @returns if type is undefined", () => {
    const result = new TSDocBuilder()
      .open()
      .addReturns(undefined)
      .close()
      .toString();
    expect(result).not.toContain("@returns");
  });

  it("should omit @returns if type is void", () => {
    const result = new TSDocBuilder()
      .open()
      .addReturns("void")
      .close()
      .toString();
    expect(result).not.toContain("@returns");
  });

  it("should omit @returns if type is undefined", () => {
    const result = new TSDocBuilder()
      .open()
      .addReturns("undefined")
      .close()
      .toString();
    expect(result).not.toContain("@returns");
  });
});
