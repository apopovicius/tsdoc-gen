import { Node, SyntaxKind, VariableDeclaration } from "ts-morph";
import { tsdocTemplates } from "../tsdoc-templates";
import { extractParamMetadata } from "../formatters/param-metadata";
import { shouldIncludeReturns } from "../formatters/returns";
import { TSDocGenerator } from "./types";
import { TSDocGeneratorOptions } from "../config";

export class ArrowFunctionHandler implements TSDocGenerator {
  canHandle(node: Node): boolean {
    if (Node.isArrowFunction(node)) {
      return true;
    }

    if (!Node.isVariableDeclaration(node)) {
      return false;
    }
    return Node.isArrowFunction(node.getInitializer());
  }

  generate(node: Node, options?: TSDocGeneratorOptions): string {
    let arrowFn: import("ts-morph").ArrowFunction;
    let name = "<anonymous>";

    if (Node.isArrowFunction(node)) {
      arrowFn = node;
      // Optional: try to infer name from surrounding context if needed
    } else {
      const decl = node.asKindOrThrow(SyntaxKind.VariableDeclaration);
      arrowFn = decl
        .getInitializerOrThrow()
        .asKindOrThrow(SyntaxKind.ArrowFunction);

      name = decl.getName();
    }

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
