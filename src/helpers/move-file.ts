import * as fs from "fs-extra";
import * as path from "path";

export function moveFile(oldFn: string, newFn: string) {
  const newPath = path.dirname(newFn);
  fs.mkdirsSync(newPath);
  fs.moveSync(oldFn, newFn, { overwrite: true });
}
