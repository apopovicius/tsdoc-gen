// import * as vscode from "vscode";
import { TSDocBuilder } from "./formatters/tsdoc-builder";

// const config = vscode.workspace.getConfiguration("tsdocGen");
// const includeReturnsForVoid = config.get<boolean>(
//   "includeReturnsForVoid",
//   false
// );
// const includeEmptyParamBlock = config.get<boolean>(
//   "includeEmptyParamBlock",
//   false
// );

// const IGNORED_RETURN_PATTERNS = [
//   /^void$/,
//   /^undefined$/,
//   /^null$/,
//   /^Promise<\s*(void|undefined|null)\s*>$/,
//   /^Observable<\s*(void|undefined|null)\s*>$/,
// ];

// function shouldIncludeReturn(type: string): boolean {
//   if (includeReturnsForVoid) {
//     return true;
//   }
//   return !IGNORED_RETURN_PATTERNS.some((pattern) => pattern.test(type.trim()));
// }

export const tsdocTemplates = {
  function(name: string, params: string[][], returnType: string): string {
    return new TSDocBuilder()
      .open()
      .addLine(`TODO: Describe the ${name} function.`)
      .addParams(params)
      .addReturns(returnType)
      .close()
      .toString();
  },

  method(name: string, params: string[][], returnType: string): string {
    return new TSDocBuilder()
      .open()
      .addLine(`TODO: Describe the ${name} method.`)
      .addParams(params)
      .addReturns(returnType)
      .close()
      .toString();
  },

  arrowFunction(
    name: string | undefined,
    params: string[][],
    returnType: string
  ): string {
    const title = name ? `arrow function (${name})` : "arrow function";
    return new TSDocBuilder()
      .open()
      .addLine(`TODO: Describe this ${title}.`)
      .addParams(params)
      .addReturns(returnType)
      .close()
      .toString();
  },

  property(name: string, type: string): string {
    return new TSDocBuilder()
      .open()
      .addLine(`TODO: Describe the ${name} property.`)
      .addEmptyLine()
      .addLine(`@type {${type}}`)
      .close()
      .toString();
  },

  class(name: string): string {
    return new TSDocBuilder()
      .open()
      .addLine(`TODO: Describe the ${name} class.`)
      .close()
      .toString();
  },

  fallback(): string {
    return new TSDocBuilder()
      .open()
      .addLine("TODO: Add documentation.")
      .close()
      .toString();
  },
};
