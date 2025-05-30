import { Node, SyntaxKind } from "ts-morph";
import { tsdocTemplates } from "../tsdoc-templates";
import type { TSDocGenerator } from "./types";
import { TSDocGeneratorOptions } from "../config";

export class ClassHandler implements TSDocGenerator {
  canHandle(node: Node): boolean {
    return node.getKind() === SyntaxKind.ClassDeclaration;
  }

  generate(node: Node, _options?: TSDocGeneratorOptions): string {
    const cls = node.asKindOrThrow(SyntaxKind.ClassDeclaration);
    const name = cls.getName() ?? "Class";

    return tsdocTemplates.generateForClass({
      name,
    });
  }
}
