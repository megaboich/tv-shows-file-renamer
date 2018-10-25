import * as path from "path";
import * as fs from "fs";
// List all files in a directory in Node.js recursively in a synchronous fashion
export function getAllFilesFlat(dir: string): string[] {
  const files = fs.readdirSync(dir);
  const fileList: string[] = [];
  for (const file of files) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      const children = getAllFilesFlat(path.join(dir, file));
      fileList.push(...children);
    } else {
      fileList.push(path.join(dir, file));
    }
  }
  return fileList;
}
