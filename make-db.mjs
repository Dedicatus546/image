import fs from "node:fs/promises";
import path from "node:path";

const createDBFile = async () => {
  await fs.writeFile(
    "db.json",
    JSON.stringify({
      list: [],
      total: 0,
    })
  );
};

const db = [];

const insertDB = async (dir) => {
  const pathList = await fs.readdir(dir);
  for (const p of pathList) {
    const stat = await fs.stat(path.join(dir, p));
    if (stat.isDirectory() && /\d+/g.test(p)) {
      const nextDir = path.join(dir, p);
      await insertDB(nextDir);
    } else if (/^\d{15,17}\..*$/g.test(p)) {
      db.push({
        path: path.join(dir, p),
        name: p,
      });
    }
  }
};

const updateDB = async () => {
  await fs.writeFile("db.json", JSON.stringify(db, undefined, 2));
};

await createDBFile();
await insertDB(".");
db.list = db.reverse();
await updateDB();
