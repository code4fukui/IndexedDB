# IndexedDB

[IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)を手軽に扱えるライブラリです。

## デモ
- [IndexedCache.js](https://github.com/code4fukui/IndexedCache/)

## 機能
- データベースの作成・接続
- データの追加・更新・取得・削除
- 複数のインデックスによる検索

## 使い方
```js
import { IndexedDB } from "https://code4fukui.github.io/IndexedDB/IndexedDB.js";

const db = await IndexedDB.create("test", ["name", "description"]);

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

## ライセンス
MIT License