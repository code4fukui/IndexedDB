import { IndexDB } from "./IndexDB.js";

export class Cache {
  constructor(db) {
    this.db = db;
  }
  static async create(dbname = "cache") {
    const db = await IndexDB.create(dbname, ["url", "data"]);
    return new Cache(db);
  }
  async fetchOrLoad(url) {
    const res = await this.db.get("url", url);
    if (res.length > 0) {
      return res[0].data;
    }
    const res2 = new Uint8Array(await (await fetch(url)).arrayBuffer());
    await this.db.add({ url, data: res2 });
    return res2;
  }
}

let cache = null;

export const fetchOrLoad = async (url) => {
  if (!cache) {
    cache = await Cache.create();
  }
  const bin = await cache.fetchOrLoad(url);
  return bin;
};
