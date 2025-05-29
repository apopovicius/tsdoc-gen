import { expect, it, describe } from "vitest";
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

  it("should support adding params and return", () => {
    const result = new TSDocBuilder()
      .open()
      .addLine("Example")
      .addParam("x", "number")
      .addReturns("string")
      .close()
      .toString();

    expect(result).toContain("@param x {number}");
    expect(result).toContain("@returns string");
  });

  it("should not add return if type is null", () => {
    const result = new TSDocBuilder()
      .open()
      .addReturns(null)
      .close()
      .toString();

    expect(result).not.toContain("@returns");
  });
});
