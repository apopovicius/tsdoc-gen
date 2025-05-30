import { Node, SyntaxKind } from "ts-morph";
import { tsdocTemplates } from "../tsdoc-templates";
import type { TSDocGenerator } from "./types";
import type { TSDocGeneratorOptions } from "../config";

export class VariableHandler implements TSDocGenerator {
  canHandle(node: Node): boolean {
    return node.getKind() === SyntaxKind.VariableDeclaration;
  }

  generate(node: Node, _options?: TSDocGeneratorOptions): string {
    const decl = node.asKindOrThrow(SyntaxKind.VariableDeclaration);
    const name = decl.getName();

    const type = decl.getTypeNode()
      ? decl.getTypeNodeOrThrow().getText()
      : decl.getType().getBaseTypeOfLiteralType().getText(decl);

    return tsdocTemplates.generateForVariable({
      name,
      type,
    });
  }
}
