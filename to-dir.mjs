import path from "node:path";
import fs from "node:fs/promises";

const main = async () => {
  const filenameList = await fs.readdir(".");
  console.log("filename count", filenameList.length);
  for (const filename of filenameList) {
    await cp(filename);
  }
};

/**
 *
 * @param {string} filename
 */
const cp = async (filename) => {
  if (/^\d{15}/.test(filename)) {
    const year = filename.substring(0, 4);
    const month = filename.substring(4, 6);
    const day = filename.substring(6, 8);
    const dir = path.join(".", year, month, day);
    console.log("dir", dir);
    await fs.mkdir(path.join(".", year, month, day), {
      recursive: true,
    });
    await fs.cp(
      path.join(".", filename),
      path.join(".", year, month, day, filename)
    );
  }
};

await main();
