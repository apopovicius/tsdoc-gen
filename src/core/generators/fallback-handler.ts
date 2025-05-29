import { Node } from "ts-morph";
import { TSDocHandler } from "./tsdoc-handler";
import { tsdocTemplates } from "../templates";

export class FallbackHandler implements TSDocHandler {
  canHandle(_node: Node): boolean {
    return true; // fallback catches all
  }

  generate(p0: any): string {
    return tsdocTemplates.fallback();
  }
}
