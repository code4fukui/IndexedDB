export class IndexDB {
  constructor(db) {
    this.db = db;
  }
  static async create(dbName, names) {
    return new Promise((resolve, reject) => {
      const dbVersion = 3;
      const request = indexedDB.open(dbName, dbVersion);

      request.onupgradeneeded = function(event) {
        const db = event.target.result;
        // first: create objectstore and index
        const objectStore = db.createObjectStore("items", { keyPath: "id", autoIncrement: true });
        for (const n of names) {
          objectStore.createIndex(n, n, { unique: false });
        }
      };
      request.onsuccess = (event) => {
        const db = event.target.result;
        resolve(new IndexDB(db));
      };
      request.onerror = (event) => {
        reject(event.target.errorCode);
      };
    });
  }
  async add(item) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["items"], "readwrite");
      const objectStore = transaction.objectStore("items");
      const request = objectStore.add(item);
      transaction.onerror = event => reject(event);
      request.onsuccess = (event) => {
        transaction.oncomplete = () => resolve(event.target.result);
      };
      request.onerror = function(event) {
        transaction.oncomplete = () => reject(event.target.errorCode);
      };
    });
  }
  async getAll() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["items"], "readonly");
      const objectStore = transaction.objectStore("items");
      const request = objectStore.getAll(); // 全てのエントリーを取得
      transaction.onerror = event => reject(event);
      request.onsuccess = event => {
        const items = event.target.result;
        transaction.oncomplete = () => resolve(items);
      };
      request.onerror = event => {
        transaction.oncomplete = () => reject(event.target.errorCode);
      };
    });
  }
  async getAt(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["items"], "readonly");
      const objectStore = transaction.objectStore("items");
      const request = objectStore.get(id);
      transaction.onerror = event => reject(event);
      request.onsuccess = event => {
        const item = event.target.result;
        transaction.oncomplete = () => resolve(item);
      };
      request.onerror = event => {
        transaction.oncomplete = () => reject(event.target.errorCode);
      };
    });
  }
  async removeAt(id) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["items"], "readwrite");
      const objectStore = transaction.objectStore("items");
      const request = objectStore.delete(id);
      transaction.onerror = event => reject(event);
      request.onsuccess = event => {
        const item = event.target.result;
        transaction.oncomplete = () => resolve(item);
      };
      request.onerror = event => {
        transaction.oncomplete = () => reject(event.target.errorCode);
      };
    });
  }
  async get(keyname, key) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["items"], "readonly");
      const objectStore = transaction.objectStore("items");
      const vendorIndex = objectStore.index(keyname);
      const keyRng = IDBKeyRange.only(key);
      const request = vendorIndex.openCursor(keyRng);
      transaction.onerror = event => reject(event);
      const res = [];
      request.onsuccess = e => {
        const cursor = e.target.result;
        if (cursor) {
          res.push(cursor.value);
          cursor.continue();
        } else {
          transaction.oncomplete = () => resolve(res);
        }
      };
    });
  }
  async remove(keyname, key) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(["items"], "readwrite");
      const objectStore = transaction.objectStore("items");
      const vendorIndex = objectStore.index(keyname);
      const keyRng = IDBKeyRange.only(key);
      const request = vendorIndex.openCursor(keyRng);
      transaction.onerror = event => reject(event);
      request.onsuccess = e => {
        const cursor = e.target.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          transaction.oncomplete = () => resolve();
        }
      };
    });
  }
  //const updateRequest = cursor.update(invoice);
};
