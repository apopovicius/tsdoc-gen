import { Node, SyntaxKind } from "ts-morph";
import { TSDocHandler } from "./TSDocHandler";
import { tsdocTemplates } from "../templates";
import { extractParamMetadata } from "../formatters/param-metadata";

export class FunctionHandler implements TSDocHandler {
  canHandle(node: Node): boolean {
    return node.getKind() === SyntaxKind.FunctionDeclaration;
  }

  generate(node: Node): string {
    const fn = node.asKindOrThrow(SyntaxKind.FunctionDeclaration);
    const name = fn.getName() ?? "function";
    const params = extractParamMetadata(fn.getParameters());
    const returnType = fn.getReturnType().getText();
    return tsdocTemplates.function(name, params, returnType);
  }
}
