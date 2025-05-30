import { Node, SyntaxKind } from "ts-morph";
import { tsdocTemplates } from "../tsdoc-templates";
import { extractParamMetadata } from "../formatters/param-metadata";
import { shouldIncludeReturns } from "../formatters/returns";
import type { TSDocGenerator } from "./types";
import type { TSDocGeneratorOptions } from "../config";

export class MethodHandler implements TSDocGenerator {
  canHandle(node: Node): boolean {
    return node.getKind() === SyntaxKind.MethodDeclaration;
  }

  generate(node: Node, options?: TSDocGeneratorOptions): string {
    const method = node.asKindOrThrow(SyntaxKind.MethodDeclaration);
    const name = method.getName();
    const params = extractParamMetadata(method.getParameters());
    const returnType = method.getReturnType().getText();

    const includeParams =
      options?.includeEmptyParamBlock === true || params.length > 0;

    const includeReturns = shouldIncludeReturns(
      returnType,
      options?.includeReturnsForVoid ?? false
    );

    return tsdocTemplates.generateForMethod({
      name,
      params,
      returnType,
      includeParams,
      includeReturns,
    });
  }
}
