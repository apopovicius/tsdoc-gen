import { Node } from "ts-morph";
import { tsdocTemplates } from "../tsdoc-templates";
import type { TSDocGenerator } from "./types";
import { TSDocGeneratorOptions } from "../config";

/**
 * A catch-all TSDoc generator used when no other handler matches.
 */
export class FallbackHandler implements TSDocGenerator {
  canHandle(_node: Node): boolean {
    return true; // Always handles — last-resort fallback
  }

  generate(_node: Node, _options?: TSDocGeneratorOptions): string {
    return tsdocTemplates.generateFallback();
  }
}
