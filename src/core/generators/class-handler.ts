import { Node, SyntaxKind } from "ts-morph";
import { TSDocHandler } from "./tsdoc-handler";
import { tsdocTemplates } from "../templates";

export class ClassHandler implements TSDocHandler {
  canHandle(node: Node): boolean {
    return node.getKind() === SyntaxKind.ClassDeclaration;
  }

  generate(node: Node): string {
    const cls = node.asKindOrThrow(SyntaxKind.ClassDeclaration);
    const name = cls.getName() ?? "Class";
    return tsdocTemplates.class(name);
  }
}
