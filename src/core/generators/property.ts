import { Node, SyntaxKind } from "ts-morph";
import { tsdocTemplates } from "../tsdoc-templates";
import type { TSDocGenerator } from "./types";
import { TSDocGeneratorOptions } from "../config";

export class PropertyHandler implements TSDocGenerator {
  canHandle(node: Node): boolean {
    return node.getKind() === SyntaxKind.PropertyDeclaration;
  }

  generate(node: Node, _options?: TSDocGeneratorOptions): string {
    const prop = node.asKindOrThrow(SyntaxKind.PropertyDeclaration);
    const name = prop.getName();
    const type = prop.getType().getText(prop);

    return tsdocTemplates.generateForProperty({ name, type });
  }
}
