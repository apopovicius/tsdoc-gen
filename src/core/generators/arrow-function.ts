import { Node, SyntaxKind, VariableDeclaration } from "ts-morph";
import { tsdocTemplates } from "../tsdoc-templates";
import { extractParamMetadata } from "../formatters/param-metadata";
import { shouldIncludeReturns } from "../formatters/returns";
import { TSDocGenerator } from "./types";
import { TSDocGeneratorOptions } from "../config";

export class ArrowFunctionHandler implements TSDocGenerator {
  canHandle(node: Node): boolean {
    if (node.getKind() !== SyntaxKind.VariableDeclaration) {
      return false;
    }

    const initializer = (node as VariableDeclaration).getInitializer();
    return initializer?.getKind() === SyntaxKind.ArrowFunction;
  }

  generate(node: Node, options?: TSDocGeneratorOptions): string {
    const decl = node.asKindOrThrow(SyntaxKind.VariableDeclaration);
    const arrowFn = decl
      .getInitializerOrThrow()
      .asKindOrThrow(SyntaxKind.ArrowFunction);

    const name = decl.getName();
    const params = extractParamMetadata(arrowFn.getParameters());
    const returnType = arrowFn.getReturnType().getText();

    const includeParams = options?.includeEmptyParamBlock || params.length > 0;
    const includeReturns = shouldIncludeReturns(
      returnType,
      options?.includeReturnsForVoid ?? false
    );

    return tsdocTemplates.generateForArrowFunction({
      name,
      params,
      returnType,
      includeParams,
      includeReturns,
    });
  }
}
