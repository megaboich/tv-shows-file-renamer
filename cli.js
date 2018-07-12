#!/usr/bin/env node
const fs = require("fs");
const crypto = require("crypto");
const commander = require("commander");

function genFile(fileName, fileSizeInMb) {
  const targetFile = fs.openSync(fileName, "w");
  for (let blockIndex = 0; blockIndex < fileSizeInMb; ++blockIndex) {
    const newBlock = crypto.randomBytes(1024 * 1024);
    fs.writeSync(targetFile, newBlock, 0, newBlock.length);
  }
  fs.closeSync(targetFile);
}

async function main() {
  console.log("Noise file generator 1.0");

  const cmdParams = commander
    .version("0.1.0")
    .option("-s, --size [value]", "File size")
    .option("-f, --fileName [value]", "File name")
    .option("-c, --count [value]", "Files count")
    .parse(process.argv);

  const fileSizeInMb = parseInt(cmdParams.size || "100");
  if (isNaN(fileSizeInMb)) {
    throw new Error("File size should be integer - file size in MB");
  }
  console.log("File size in MB: " + fileSizeInMb);
  const fileName = cmdParams.fileName || "noise-file";
  console.log("File name: " + fileName);
  const filesCount = parseInt(cmdParams.count || "1");
  if (isNaN(filesCount)) {
    throw new Error("Files count should be integer");
  }
  console.log("Files count: " + filesCount);

  if (filesCount == 1) {
    genFile(fileName, fileSizeInMb);
  } else {
    for (let counter = 0; counter < filesCount; ++counter) {
      const fileNameWithCounter =
        fileName + "_" + counter.toString().padStart("0", 6);
      genFile(fileNameWithCounter, fileSizeInMb);
    }
  }

  console.log("all done");
}

return main();
