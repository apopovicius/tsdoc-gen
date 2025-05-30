import { TSDocBuilder } from "./formatters";

export type ParamMeta = [name: string, type: string];

export const tsdocTemplates = {
  generateForFunction(opts: {
    name: string;
    params: ParamMeta[];
    returnType: string;
    includeParams: boolean;
    includeReturns: boolean;
  }): string {
    return new TSDocBuilder()
      .open()
      .addLine(`TODO: Describe the ${opts.name} function.`)
      .addParams(opts.params, opts.includeParams)
      .addReturns(opts.returnType, opts.includeReturns)
      .close()
      .toString();
  },

  generateForMethod(opts: {
    name: string;
    params: ParamMeta[];
    returnType: string;
    includeParams: boolean;
    includeReturns: boolean;
  }): string {
    return new TSDocBuilder()
      .open()
      .addLine(`TODO: Describe the ${opts.name} method.`)
      .addParams(opts.params, opts.includeParams)
      .addReturns(opts.returnType, opts.includeReturns)
      .close()
      .toString();
  },

  generateForArrowFunction(opts: {
    name?: string;
    params: ParamMeta[];
    returnType: string;
    includeParams: boolean;
    includeReturns: boolean;
  }): string {
    const title = opts.name
      ? `arrow function (${opts.name})`
      : "arrow function";

    return new TSDocBuilder()
      .open()
      .addLine(`TODO: Describe this ${title}.`)
      .addParams(opts.params, opts.includeParams)
      .addReturns(opts.returnType, opts.includeReturns)
      .close()
      .toString();
  },

  generateForProperty(opts: {
    name: string;
    type: string;
    defaultValue: string;
  }): string {
    return new TSDocBuilder()
      .open()
      .addLine(`TODO: Describe the ${opts.name} property.`)
      .addEmptyLine()
      .addLine(`@type {${opts.type}}`)
      .addConditionalLine(!!opts.defaultValue, `@default ${opts.defaultValue}`)
      .close()
      .toString();
  },

  generateForClass(opts: { name: string }): string {
    return new TSDocBuilder()
      .open()
      .addLine(`TODO: Describe the ${opts.name} class.`)
      .close()
      .toString();
  },

  generateFallback(): string {
    return new TSDocBuilder()
      .open()
      .addLine("TODO: Add documentation.")
      .close()
      .toString();
  },

  generateForVariable(opts: { name: string; type: string }): string {
    return new TSDocBuilder()
      .open()
      .addLine(`TODO: Describe the ${opts.name} variable.`)
      .addEmptyLine()
      .addLine(`@type {${opts.type}}`)
      .close()
      .toString();
  },

  generateForConstructor(opts: {
    params: ParamMeta[];
    includeParams: boolean;
  }): string {
    return new TSDocBuilder()
      .open()
      .addLine("Creates an instance of the class.")
      .addParams(opts.params, opts.includeParams)
      .close()
      .toString();
  },
};
