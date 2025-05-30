import { Node, SyntaxKind } from "ts-morph";
import { tsdocTemplates } from "../tsdoc-templates";
import { extractParamMetadata } from "../formatters/param-metadata";
import { shouldIncludeReturns } from "../formatters/returns";
import type { TSDocGenerator } from "./types";
import type { TSDocGeneratorOptions } from "../config";

export class FunctionHandler implements TSDocGenerator {
  canHandle(node: Node): boolean {
    return node.getKind() === SyntaxKind.FunctionDeclaration;
  }

  generate(node: Node, options?: TSDocGeneratorOptions): string {
    const fn = node.asKindOrThrow(SyntaxKind.FunctionDeclaration);
    const name = fn.getName() ?? "function";
    const params = extractParamMetadata(fn.getParameters());
    const returnType = fn.getReturnType().getText();

    const includeParams =
      options?.includeEmptyParamBlock === true || params.length > 0;

    const includeReturns = shouldIncludeReturns(
      returnType,
      options?.includeReturnsForVoid ?? false
    );

    return tsdocTemplates.generateForFunction({
      name,
      params,
      returnType,
      includeParams,
      includeReturns,
    });
  }
}
