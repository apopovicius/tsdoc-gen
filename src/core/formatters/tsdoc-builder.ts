import type { ParamMeta } from "../tsdoc-templates";

/**
 * A fluent builder for generating well-formatted TSDoc blocks.
 */
export class TSDocBuilder {
  private lines: string[] = [];

  /**
   * Opens the TSDoc comment block.
   */
  open(): this {
    this.lines.push("/**");
    return this;
  }

  /**
   * Adds a single content line with a leading asterisk.
   */
  addLine(line: string): this {
    this.lines.push(` * ${line}`);
    return this;
  }

  /**
   * Adds a line with a leading asterisk, but only if the condition is true.
   */
  addConditionalLine(condition: boolean, line: string): this {
    if (condition) {
      this.addLine(line);
    }
    return this;
  }

  /**
   * Adds an empty line (` *`) for spacing.
   */
  addEmptyLine(): this {
    this.lines.push(" *");
    return this;
  }

  /**
   * Adds a `@param` line for a single parameter.
   */
  addParam(name: string, type: string): this {
    this.addLine(`@param ${name} - {${type}}`);
    return this;
  }

  /**
   * Adds all `@param` lines from an array of [name, type] pairs.
   * Optionally includes an empty param block when there are no parameters.
   */
  addParams(params: ParamMeta[], includeEmpty?: boolean): this {
    if (params.length === 0) {
      if (includeEmpty) {
        this.addLine("@param"); // or customize this placeholder
      }
      return this;
    }

    params.forEach(([name, type]) => this.addParam(name, type));
    return this;
  }

  /**
   * Adds a `@returns` line for the given return type.
   */
  addReturns(
    type: string | undefined | null,
    includeVoid: boolean = false
  ): this {
    if (!type) {
      return this;
    }

    const normalized = type.trim().toLowerCase();

    const isVoidLike =
      normalized === "void" ||
      normalized === "undefined" ||
      normalized === "null" ||
      /^promise<\s*(void|undefined|null)\s*>$/.test(normalized) ||
      /^observable<\s*(void|undefined|null)\s*>$/.test(normalized);

    if (isVoidLike && !includeVoid) {
      return this;
    }

    this.addLine(`@returns ${type}`);
    return this;
  }

  /**
   * Closes the TSDoc comment block.
   */
  close(): this {
    this.lines.push(" */");
    return this;
  }

  /**
   * Returns the full TSDoc block as a string.
   */
  toString(): string {
    return this.lines.join("\n");
  }
}
