import Track from '../data/track'
import Artist from '../data/artist'
import Album from '../data/album'

export default class Deserializer {
  deserializeTracks (tracks) {
    if (!tracks) return []
    return tracks.map(track => this.deserializeTrack(track))
  }

  deserializeTrack (track) {
    if (!track || !track.id) return null
    let id = track.id
    let title = track.title ? track.title : 'Unknown Track'
    let artist = this.deserializeArtist(track.artist)
    let album = this.deserializeAlbum(track.album)
    let number = track.number ? track.number : 0
    let discNumber = track.discNumber ? track.discNumber : 1
    let filePath = track.filePath
    return new Track(id, title, artist, album, number, discNumber, filePath)
  }

  deserializeArtists (artists) {
    if (!artists) return []
    return artists.map(artist => this.deserializeArtist(artist))
  }

  deserializeArtist (artist) {
    if (!artist || !artist.id) return null
    let id = artist.id
    let name = artist.name ? artist.name : 'Unknown Artist'
    let albums = this.deserializeAlbums(artist.albums)
    let featureAlbums = this.deserializeAlbums(artist.featureAlbums)
    return new Artist(id, name, albums, featureAlbums)
  }

  deserializeAlbums (albums) {
    if (!albums) return []
    return albums.map(album => this.deserializeAlbum(album))
  }

  deserializeAlbum (album) {
    if (!album || !album.id) return null
    let id = album.id
    let artist = this.deserializeArtist(album.artist)
    let title = album.title ? album.title : 'Unknown Album'
    let year = album.year
    let tracks = this.deserializeTracks(album.tracks)
    let featureArtists = this.deserializeArtists(album.featureArtists)
    return new Album(id, artist, title, year, tracks, featureArtists)
  }
}
