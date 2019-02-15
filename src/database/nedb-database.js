import Datastore from "nedb";
import { Database } from "mel-core";

const DATABASE_DIRECTORY_NAME = "data";

export default class NedbDatabase extends Database {
  constructor(databaseDirectory) {
    super();
    this._databaseDirectory = databaseDirectory;
    this._db = [];
  }

  async _loadDatabase(databaseName) {
    const dataStore = new Datastore({
      filename: `${
        this._databaseDirectory
      }/${DATABASE_DIRECTORY_NAME}/${databaseName}.db`
    });
    dataStore.loadDatabase();
    return this._wrapDataStore(dataStore);
  }

  _wrapDataStore(dataStore) {
    return {
      insert: data =>
        new Promise((resolve, reject) =>
          dataStore.insert(data, (error, newData) => {
            if (error) reject(error);
            resolve(newData);
          })
        ),
      update: (needle, data) =>
        new Promise((resolve, reject) =>
          dataStore.update(needle, data, (error, newData) => {
            if (error) reject(error);
            resolve(newData);
          })
        ),
      find: needle =>
        new Promise((resolve, reject) =>
          dataStore.find(needle, (error, values) => {
            if (error) reject(error);
            resolve(values);
          })
        ),
      findOne: needle =>
        new Promise((resolve, reject) =>
          dataStore.findOne(needle, (error, value) => {
            if (error) reject(error);
            resolve(value);
          })
        )
    };
  }
}
