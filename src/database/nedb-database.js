import Datastore from "nedb";
import { Database } from "mel-core";

const DATABASE_DIRECTORY_NAME = "data";
const TRACKS_DB_FILENAME = "tracks.db";
const ALBUMS_DB_FILENAME = "albums.db";
const ARTISTS_DB_FILENAME = "artists.db";
const FILES_DB_FILENAME = "files.db";
const DB_META_FILENAME = "meta.db";

export default class NedbDatabase extends Database {
  constructor(databaseDirectory) {
    super();
    this._databaseDirectory = databaseDirectory;
    this._db = {};
  }

  async _loadDatabase() {
    this._db.artists = new Datastore({
      filename: `${
        this._databaseDirectory
      }/${DATABASE_DIRECTORY_NAME}/${ARTISTS_DB_FILENAME}`
    });
    this._db.artists.loadDatabase();
    this._db.albums = new Datastore({
      filename: `${
        this._databaseDirectory
      }/${DATABASE_DIRECTORY_NAME}/${ALBUMS_DB_FILENAME}`
    });
    this._db.albums.loadDatabase();
    this._db.tracks = new Datastore({
      filename: `${
        this._databaseDirectory
      }/${DATABASE_DIRECTORY_NAME}/${TRACKS_DB_FILENAME}`
    });
    this._db.tracks.loadDatabase();
    this._db.files = new Datastore({
      filename: `${
        this._databaseDirectory
      }/${DATABASE_DIRECTORY_NAME}/${FILES_DB_FILENAME}`
    });
    this._db.files.loadDatabase();
    this._db.databaseMetaData = new Datastore({
      filename: `${
        this._databaseDirectory
      }/${DATABASE_DIRECTORY_NAME}/${DB_META_FILENAME}`
    });
    this._db.databaseMetaData.loadDatabase();
  }

  async _readDatabaseMetaData(key) {
    let databaseMetaData = this._db.databaseMetaData;
    databaseMetaData.findOne({ key }, (err, value) => {
      if (err) {
        throw err;
      } else {
        return value;
      }
    });
  }

  async _updateDatabaseMetaData(key, value) {
    let databaseMetaData = this._db.databaseMetaData;
    databaseMetaData.update(
      { key },
      { key, value },
      { upsert: true },
      (err, newData) => {
        if (err) {
          throw err;
        } else {
          return newData;
        }
      }
    );
  }

  async _createFile(file) {
    return new Promise((resolve, reject) => {
      let files = this._db.files;
      files.insert(file, (err, newFile) => {
        if (err) {
          reject(err);
        } else {
          resolve(newFile);
        }
      });
    });
  }

  async _readFile(filePath) {
    return new Promise((resolve, reject) => {
      let files = this._db.files;
      files.findOne({ path: filePath }, (err, file) => {
        if (err) {
          reject(err);
        } else {
          resolve(file);
        }
      });
    });
  }

  async _readFilesByTrackId(trackId) {
    return new Promise((resolve, reject) => {
      let files = this._db.files;
      files.find({ trackId }, (err, file) => {
        if (err) {
          reject(err);
        } else {
          resolve(file);
        }
      });
    });
  }

  async _updateFile(file) {
    return new Promise((resolve, reject) => {
      let files = this._db.files;
      files.update({ path: file.path }, file, (err, newDoc) => {
        if (err) {
          reject(err);
        } else {
          resolve(newDoc);
        }
      });
    });
  }

  async _createTrack(track) {
    return new Promise((resolve, reject) => {
      let tracks = this._db.tracks;
      tracks.insert(track, (err, newTrack) => {
        if (err) {
          reject(err);
        } else {
          resolve(newTrack);
        }
      });
    });
  }

  async _readTrack(trackId) {
    return new Promise((resolve, reject) => {
      let tracks = this._db.tracks;
      tracks.findOne({ id: trackId }, (err, trackJson) => {
        if (err) {
          reject(err);
        } else {
          resolve(trackJson);
        }
      });
    });
  }

  async _updateTrack(trackJson) {
    return new Promise((resolve, reject) => {
      let tracks = this._db.tracks;
      tracks.update({ id: trackJson.id }, trackJson, (err, docs) => {
        if (err) {
          reject(err);
        }
        resolve(docs);
      });
    });
  }

  async _createAlbum(album) {
    return new Promise((resolve, reject) => {
      let albums = this._db.albums;
      albums.insert(album, (err, insertedAlbum) => {
        if (err) {
          reject(err);
        } else {
          resolve(insertedAlbum);
        }
      });
    });
  }

  async _readAlbum(albumId) {
    return new Promise((resolve, reject) => {
      let albums = this._db.albums;
      albums.findOne({ id: albumId }, (err, album) => {
        if (err) {
          reject(err);
        } else {
          resolve(album);
        }
      });
    });
  }

  async _updateAlbum(albumJson) {
    return new Promise((resolve, reject) => {
      let albums = this._db.albums;
      albums.update({ id: albumJson.id }, albumJson, (err, docs) => {
        if (err) {
          reject(err);
        }
        resolve(docs);
      });
    });
  }

  async _createArtist(artist) {
    return new Promise((resolve, reject) => {
      let artists = this._db.artists;
      artists.insert(artist, (error, insertedArtist) => {
        if (error) {
          reject(new Error(`Could not create artist:\n${error}`));
        }
        resolve(insertedArtist);
      });
    });
  }

  async _readArtist(artistId) {
    return new Promise((resolve, reject) => {
      let artists = this._db.artists;
      artists.findOne({ id: artistId }, (error, artist) => {
        if (error) {
          reject(new Error(`Could not read artist ${artistId}:\n${error}`));
        }
        resolve(artist);
      });
    });
  }

  async _updateArtist(artistJson) {
    return new Promise((resolve, reject) => {
      let artists = this._db.artists;
      artists.update({ id: artistJson.id }, artistJson, (error, docs) => {
        if (error) {
          reject(
            new Error(`Could not update artist ${artistJson.id}:\n${error}`)
          );
        }
        resolve(docs);
      });
    });
  }

  async _readArtists() {
    return new Promise((resolve, reject) => {
      let artists = this._db.artists;
      artists.find({}, (error, artists) => {
        if (error) {
          reject(new Error(`Could not read artists:\n${error}`));
        }
        resolve(artists);
      });
    });
  }
}
