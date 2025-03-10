import { callback, promise } from "../api/async.js";
import { sync } from "../api/sync.js";
import { Options, Output, ResultCallback } from "../types.js";

export class APIBuilder<TReturnType extends Output> {
  constructor(
    private readonly root: string,
    private readonly options: Options
  ) {}

  withPromise(): Promise<TReturnType> {
    return promise(this.root, this.options);
  }

  withCallback(cb: ResultCallback<TReturnType>) {
    callback(this.root, this.options, cb);
  }

  sync(): TReturnType {
    return sync(this.root, this.options);
  }
}
