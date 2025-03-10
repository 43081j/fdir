import { Output, Options } from "../types.js";
import { Walker } from "./walker.js";

export function sync<TOutput extends Output>(
  root: string,
  options: Options
): TOutput {
  const walker = new Walker<TOutput>(root, options);
  return walker.start() as TOutput;
}
