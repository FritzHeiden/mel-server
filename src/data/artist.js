export default class Artist {
  constructor (id, name, albums, featureAlbums) {
    this._id = id
    this._name = name
    this._albums = albums || []
    this._featureAlbums = featureAlbums || []
  }

  addAlbum (album) {
    album.artist = this
    this._albums.push(album)
  }

  addFeatureAlbum (album) {
    if (this._featureAlbums.indexOf(album) < 0) {
      this._featureAlbums.push(album)
      album.addFeatureArtist(this)
    }
  }

  get name () {
    return this._name
  }

  set name (value) {
    this._name = value
  }

  get albums () {
    return this._albums
  }
  set albums (value) {
    this._albums = value
  }

  get id () {
    return this._id
  }

  set id (value) {
    this._id = value
  }

  get featureAlbums () {
    return this._featureAlbums
  }

  set featureAlbums (value) {
    this._featureAlbums = value
  }
}
