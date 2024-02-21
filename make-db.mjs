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

const db = {
  list: [],
  total: 0,
};

const insertDB = async (dir) => {
  const pathList = await fs.readdir(dir);
  for (const p of pathList) {
    const stat = await fs.stat(path.join(dir, p));
    if (stat.isDirectory() && /\d+/g.test(p)) {
      const nextDir = path.join(dir, p);
      await insertDB(nextDir);
    } else if (/^\d{15}\..*$/g.test(p)) {
      db.list.push({
        path: path.join(dir, p),
        name: p,
      });
      db.total++;
    }
  }
};

const updateDB = async () => {
  await fs.writeFile("db.json", JSON.stringify(db));
};

await createDBFile();
await insertDB(".");
db.list = db.list.reverse();
await updateDB();
