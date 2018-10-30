export default class Album {
  constructor (id, artist, title, year, tracks, featureArtists) {
    this._id = id
    this._title = title
    this._year = year
    this._tracks = tracks || []
    this._artist = artist
    this._featureArtists = featureArtists || []
  }

  addTrack (track) {
    track.album = this
    this._tracks.push(track)
  }

  addFeatureArtist (artist) {
    if (this._featureArtists.indexOf(artist) < 0) {
      this._featureArtists.push(artist)
      artist.addFeatureAlbum(this)
    }
  }

  set artist (artist) {
    this._artist = artist
  }

  get artist () {
    return this._artist
  }

  get title () {
    return this._title
  }

  set title (value) {
    this._title = value
  }

  get year () {
    return this._year
  }

  set year (value) {
    this._year = value
  }

  get tracks () {
    return this._tracks
  }

  set tracks (value) {
    this._tracks = value
  }

  get id () {
    return this._id
  }

  set id (value) {
    this._id = value
  }

  get featureArtists () {
    return this._featureArtists
  }

  set featureArtists (value) {
    this._featureArtists = value
  }
}
