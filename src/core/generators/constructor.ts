import { Node, SyntaxKind } from "ts-morph";
import { tsdocTemplates } from "../tsdoc-templates";
import { extractParamMetadata } from "../formatters/param-metadata";
import type { TSDocGenerator } from "./types";
import type { TSDocGeneratorOptions } from "../config";

export class ConstructorHandler implements TSDocGenerator {
  canHandle(node: Node): boolean {
    return node.getKind() === SyntaxKind.Constructor;
  }

  generate(node: Node, options?: TSDocGeneratorOptions): string {
    const ctor = node.asKindOrThrow(SyntaxKind.Constructor);
    const params = extractParamMetadata(ctor.getParameters());

    const includeParams = options?.includeEmptyParamBlock || params.length > 0;

    return tsdocTemplates.generateForConstructor({
      params,
      includeParams,
    });
  }
}
