export class TSDocBuilder {
  private lines: string[] = [];

  open(): this {
    this.lines.push("/**");
    return this;
  }

  addLine(line: string): this {
    this.lines.push(` * ${line}`);
    return this;
  }

  addEmptyLine(): this {
    this.lines.push(" *");
    return this;
  }

  addParam(name: string, type: string): this {
    this.addLine(`@param ${name} {${type}} - Description`);
    return this;
  }

  addParams(params: string[][], includeEmpty?: boolean): this {
    if (params.length === 0 && !includeEmpty) {
      return this;
    }
    params.forEach(([name, type]) => this.addParam(name, type));
    return this;
  }

  addReturns(type: string | null): this {
    if (!type) {
      return this;
    }
    this.addLine(`@returns ${type}`);
    return this;
  }

  close(): this {
    this.lines.push(" */");
    return this;
  }

  toString(): string {
    return this.lines.join("\n");
  }
}
