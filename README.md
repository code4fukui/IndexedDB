# IndexDB

an easy lib for IndexDB

## Usage

```js
import { IndexDB } from "https://code4fukui.github.io/IndexDB/IndexDB.js";

const db = await IndexDB.create("test", ["name", "description"]);

const item = { name: 'Sample Item', description: 'This is an example.' };
await db.add(item);

const item2 = { name: 'Sample Item2', description: 'This is an example2.' };
await db.add(item2);

const items = await db.getAll();
console.log(items);

for (let i = 1; i < 20; i++) {
  const item = await db.getAt(i);
  console.log(i, item);
}
```

## Usage of Cache / fetchOrLoad

```js
import { fetchOrLoad } from "https://code4fukui.github.io/IndexDB/Cache.js";

const bin = await fetchOrLoad("./somedata.bin");
```
