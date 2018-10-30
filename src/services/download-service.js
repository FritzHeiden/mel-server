import { Artist } from 'mel-core'
import JSZip from 'jszip'
import EventEmitter from '../tools/event-emitter'
import Album from '../data/album'

const DOWNLOAD_LIST_CHANGE = 'download_list_change'
const TOTAL_SIZE_CHANGE = 'total_size_change'
const TOTAL_LOADED_CHANGE = 'total_loaded_change'
const CURRENT_TRACK_CHANGE = 'current_track_change'
const STATE_CHANGE = 'state_change'

const PENDING = 'pending'
const DOWNLOADING = 'downloading'
const ZIPPING = 'zipping'
const DONE = 'done'

class DownloadService {
  constructor (melHttpService) {
    this._artists = []
    this._melHttpService = melHttpService
    this._eventEmitter = new EventEmitter()
    this._totalSize = 0
    this._trackSizes = {}
    this._totalLoaded = 0
    this._currentTrack = null
    this._state = PENDING
    this.addOnDownloadListChangedListener(() => this._setState(PENDING))
  }

  get artists () {
    return this._artists
  }

  addOnDownloadListChangedListener (listener) {
    this._eventEmitter.on(DOWNLOAD_LIST_CHANGE, listener)
  }

  addOnTotalSizeChangedListener (listener) {
    this._eventEmitter.on(TOTAL_SIZE_CHANGE, listener)
  }

  addOnCurrentTrackChangedListener (listener) {
    this._eventEmitter.on(CURRENT_TRACK_CHANGE, listener)
  }

  addOnStateChangedListener (listener) {
    this._eventEmitter.on(STATE_CHANGE, listener)
  }

  addArtist (newArtist) {
    let artist = this._artists.find(artist => artist.id === newArtist.id)
    if (!artist) {
      this._artists.push(artist)
    } else {
      newArtist.album.forEach(album => this.addAlbum(album))
    }
    this._eventEmitter.invokeAll(DOWNLOAD_LIST_CHANGE, this._artists)
    newArtist.albums.forEach(album =>
      album.tracks.forEach(track => this._fetchTrackSize(track.id))
    )
  }

  addAlbum (newAlbum) {
    let artist = this._artists.find(artist => artist.id === newAlbum.artist.id)
    if (!artist) {
      // We only want our artist to have id and name
      const { id, name } = newAlbum.artist
      let artist = new Artist(id, name)
      artist.addAlbum(newAlbum)
      this._artists.push(artist)
    } else {
      let album = artist.albums.find(album => album.id === newAlbum.id)
      if (!album) {
        artist.addAlbum(newAlbum)
      } else {
        newAlbum.tracks.forEach(track => this.addTrack(track))
      }
    }
    this._eventEmitter.invokeAll(DOWNLOAD_LIST_CHANGE, this._artists)
    newAlbum.tracks.forEach(track => this._fetchTrackSize(track.id))
  }

  addTrack (newTrack) {
    let artist = this._artists.find(
      artist => artist.id === newTrack.album.artist.id
    )
    if (!artist) {
      const { id: albumId, title, year } = newTrack.album
      let album = new Album(albumId, null, title, year)
      album.addTrack(newTrack)

      const { id: artistId, name } = newTrack.album.artist
      let artist = new Artist(artistId, name)
      artist.addAlbums(album)
      this._artists.push(artist)
    } else {
      let album = artist.albums.find(album => album.id === newTrack.album.id)
      if (!album) {
        const { id, title, year } = newTrack.album
        let album = new Album(id, null, title, year)
        album.addTrack(newTrack)
        artist.addAlbum(album)
      } else {
        let track = album.tracks.find(track => track.id === newTrack.id)
        if (!track) {
          album.addTrack(newTrack)
        }
      }
    }
    this._eventEmitter.invokeAll(DOWNLOAD_LIST_CHANGE, this._artists)
    this._fetchTrackSize(newTrack.id)
  }

  containsAlbum (needleAlbum) {
    let artist = this._artists.find(
      artist => artist.id === needleAlbum.artist.id
    )
    if (!artist) {
      return false
    }
    let album = artist.albums.find(album => album.id === needleAlbum.id)
    if (!album) {
      return false
    }

    for (let needleTrack of needleAlbum.tracks) {
      if (!album.tracks.find(track => track.id === needleTrack.id)) {
        return false
      }
    }

    return true
  }

  deleteList () {
    this._artists = []
    this._eventEmitter.invokeAll(DOWNLOAD_LIST_CHANGE, this._artists)
    this._totalSize = 0
    this._currentTrack = null
    this._trackSizes = {}
    this._state = PENDING
    this._totalLoaded = 0
  }

  async startDownload () {
    this._setState(DOWNLOADING)
    const zip = new JSZip()
    console.log('ARTISTS', this._artists)
    for (let artist of this._artists) {
      let artistFolder = zip.folder(artist.name)

      for (let album of artist.albums) {
        let folderName = album.title
        if (typeof album.year === 'number') {
          folderName = `${album.year} - ${album.title}`
        }
        let albumFolder = artistFolder.folder(folderName)

        for (let track of album.tracks) {
          this._setCurrentTrack(track.id)
          const buffer = await this._melHttpService.downloadTrack(track.id)
          this._setCurrentTrack(null)

          let fileName = track.title + '.mp3'
          if (typeof track.number === 'number') {
            fileName =
              `${track.number}`.padStart(2, '0') + ` - ${track.title}.mp3`
          }
          albumFolder.file(fileName, buffer)
          console.log(zip)
        }
      }
    }
    this._setState(ZIPPING)
    const blob = await zip.generateAsync({ type: 'blob' })
    location.href = URL.createObjectURL(blob)
    this._setState(DONE)
  }

  async _fetchTrackSize (trackId) {
    const { size } = await this._melHttpService.getTrackDataInfo(trackId)
    this._totalSize += size
    this._trackSizes[trackId] = size
    this._eventEmitter.invokeAll(TOTAL_SIZE_CHANGE, this._totalSize)
    return size
  }

  _setCurrentTrack (trackId) {
    this._artists.forEach(artist =>
      artist.albums.forEach(album => {
        const track = album.tracks.find(track => track.id === trackId)
        this._currentTrack = track
        this._eventEmitter.invokeAll(CURRENT_TRACK_CHANGE, track)
      })
    )
  }

  getCurrentTrack () {
    return this._currentTrack
  }

  _setState (state) {
    if (state !== this._state) {
      this._state = state
      this._eventEmitter.invokeAll(STATE_CHANGE, this._state)
    }
  }

  getState () {
    return this._state
  }

  getTrackSize (trackId) {
    return this._trackSizes[trackId]
  }

  getTotalSize () {
    return this._totalSize
  }
}

let downloadService = {
  _instance: null,
  PENDING,
  DOWNLOADING,
  ZIPPING,
  DONE,
  initialize (melHttpService) {
    this._instance = new DownloadService(melHttpService)
  },
  getInstance () {
    return this._instance
  }
}

export default downloadService
