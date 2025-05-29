import { Node, SyntaxKind } from "ts-morph";
import { TSDocHandler } from "./tsdoc-handler";
import { tsdocTemplates } from "../templates";

export class PropertyHandler implements TSDocHandler {
  canHandle(node: Node): boolean {
    return node.getKind() === SyntaxKind.PropertyDeclaration;
  }

  generate(node: Node): string {
    const prop = node.asKindOrThrow(SyntaxKind.PropertyDeclaration);
    const name = prop.getName();
    const type = prop.getType().getText();
    return tsdocTemplates.property(name, type);
  }
}
