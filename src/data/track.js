export default class Track {
  constructor (id, title, artists, album, number, discNumber, filePath) {
    this._title = title
    this._artists = artists || []
    this._album = album
    this._number = number
    this._discNumber = discNumber
    this._filePath = filePath
    this._id = id
  }

  get title () {
    return this._title
  }

  set title (value) {
    this._title = value
  }

  get artists () {
    return this._artists
  }

  set artist (value) {
    this._artists = value
  }

  get album () {
    return this._album
  }

  set album (value) {
    this._album = value
  }

  get number () {
    return this._number
  }

  set number (value) {
    this._number = value
  }

  get discNumber () {
    return this._discNumber
  }

  set discNumber (value) {
    this._discNumber = value
  }

  get filePath () {
    return this._filePath
  }

  set filePath (value) {
    this._filePath = value
  }

  get id () {
    return this._id
  }

  set id (value) {
    this._id = value
  }
}
