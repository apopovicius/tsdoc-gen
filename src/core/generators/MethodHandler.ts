import { Node, SyntaxKind } from "ts-morph";
import { TSDocHandler } from "./TSDocHandler";
import { tsdocTemplates } from "../templates";
import { extractParamMetadata } from "../formatters/param-metadata";

export class MethodHandler implements TSDocHandler {
  canHandle(node: Node): boolean {
    return node.getKind() === SyntaxKind.MethodDeclaration;
  }

  generate(node: Node): string {
    const method = node.asKindOrThrow(SyntaxKind.MethodDeclaration);
    const name = method.getName();
    const params = extractParamMetadata(method.getParameters());
    const returnType = method.getReturnType().getText();

    return tsdocTemplates.method(name, params, returnType);
  }
}
