import fs from "fs";
import { WalkerState, Options } from "../../types";

export type ResolveSymlinkFunction = (
  path: string,
  state: WalkerState,
  callback: (stat: fs.Stats, path: string) => void
) => void;

const resolveSymlinksAsync: ResolveSymlinkFunction = function (
  path,
  state,
  callback
) {
  const {
    queue,
    options: { suppressErrors },
  } = state;
  queue.enqueue();

  fs.realpath(path, (error, resolvedPath) => {
    if (error) return queue.dequeue(suppressErrors ? null : error, state);

    fs.stat(resolvedPath, (error, stat) => {
      if (error) return queue.dequeue(suppressErrors ? null : error, state);

      callback(stat, resolvedPath);
      queue.dequeue(null, state);
    });
  });
};

const resolveSymlinks: ResolveSymlinkFunction = function (
  path,
  state,
  callback
) {
  const {
    queue,
    options: { suppressErrors },
  } = state;
  queue.enqueue();

  try {
    const resolvedPath = fs.realpathSync(path);
    const stat = fs.statSync(resolvedPath);

    callback(stat, resolvedPath);
  } catch (e) {
    if (!suppressErrors) throw e;
  }
};

export function build(
  options: Options,
  isSynchronous: boolean
): ResolveSymlinkFunction | null {
  if (!options.resolveSymlinks || options.excludeSymlinks) return null;

  return isSynchronous ? resolveSymlinks : resolveSymlinksAsync;
}

