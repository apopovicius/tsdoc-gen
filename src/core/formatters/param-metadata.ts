import { ParameterDeclaration } from "ts-morph";
import type { ParamMeta } from "../tsdoc-templates";

/**
 * Extracts `[name, type]` pairs from function/method/arrow params.
 */
export function extractParamMetadata(
  params: ParameterDeclaration[]
): ParamMeta[] {
  return params.map((param) => {
    const name = param.getName();
    const type = param.getType().getText(param);
    return [name, type] as [string, string];
  });
}
