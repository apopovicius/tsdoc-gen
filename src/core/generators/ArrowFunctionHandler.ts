import { Node, SyntaxKind, VariableDeclaration } from "ts-morph";
import { TSDocHandler } from "./TSDocHandler";
import { tsdocTemplates } from "../templates";
import { extractParamMetadata } from "../formatters/param-metadata";

export class ArrowFunctionHandler implements TSDocHandler {
  canHandle(node: Node): boolean {
    if (node.getKind() !== SyntaxKind.VariableDeclaration) {
      return false;
    }

    const initializer = (node as VariableDeclaration).getInitializer();
    return initializer?.getKind() === SyntaxKind.ArrowFunction;
  }

  generate(node: Node): string {
    const decl = node.asKindOrThrow(SyntaxKind.VariableDeclaration);
    const arrowFn = decl
      .getInitializerOrThrow()
      .asKindOrThrow(SyntaxKind.ArrowFunction);

    const name = decl.getName();
    const params = extractParamMetadata(arrowFn.getParameters());
    const returnType = arrowFn.getReturnType().getText();

    return tsdocTemplates.arrowFunction(name, params, returnType);
  }
}
