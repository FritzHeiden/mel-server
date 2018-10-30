import React from 'react'
import { Link } from 'react-router-dom'
import FontAwesome from '@fortawesome/fontawesome'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faDotCircle from '@fortawesome/fontawesome-free-solid/faDotCircle'
import faDownload from '@fortawesome/fontawesome-free-solid/faDownload'
import faCheck from '@fortawesome/fontawesome-free-solid/faCheck'
import faUser from '@fortawesome/fontawesome-free-solid/faUser'
import { Album } from 'mel-core'

import NavigationHistoryBar from '../components/navigation-history-bar'
import styles from './album-view.sass'
import DownloadService from '../services/download-service'
import AlbumCover from '../components/album-cover'

export default class AlbumView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.state.downloadService = DownloadService.getInstance()
    this._gatherProps(props)
    this.loadIcons()
    this._loadAlbum()
  }

  componentWillReceiveProps (newProps) {
    this._gatherProps(newProps)
    this._loadAlbum()
  }

  _gatherProps (props) {
    this.state.melClientSocket = props.melClientSocket
    this.state.albumId = props.match.params.albumId
  }

  loadIcons () {
    FontAwesome.library.add(faDotCircle)
    FontAwesome.library.add(faDownload)
    FontAwesome.library.add(faCheck)
    FontAwesome.library.add(faUser)
  }

  async _loadAlbum () {
    let album = await this.state.melClientSocket.getAlbum(this.state.albumId)

    let tracks = []

    for (let track of album.tracks) {
      tracks.push(await this.state.melClientSocket.getTrack(track.id))
    }

    album.tracks = tracks
    album.artist = await this.state.melClientSocket.getArtist(album.artist.id)

    console.log(album)

    this.state.album = album
    this.setState(this.state)
  }

  _addToDownloads () {
    const { downloadService } = this.state

    downloadService.addAlbum(this.state.album)
    this.setState(this.state)
  }

  renderTrackList () {
    return this.state.album.tracks
      .sort((a, b) => a.number - b.number)
      .map(track => {
        let listArtists = artists => {
          if (artists) {
            return track.artists.map((artist, index) => (
              <Link to={{ pathname: /artist/ + artist.id }}>
                <span>
                  {artist.name}
                  {index + 1 === album.artists.length ? '' : ', '}
                </span>
              </Link>
            ))
          } else {
            return ''
          }
        }
        return (
          <div key={track.id}>
            <span>{track.number} </span>
            <span>{track.title}</span>
            {/* {listArtists(track.artists)} */}
          </div>
        )
      })
  }

  renderOtherAlbums () {
    return this.state.album.artist.albums.map(album => (
      <div key={album.id}>
        <span>{album.year} </span>
        <span>{album.title}</span>
      </div>
    ))
  }

  render () {
    const { album } = this.state
    if (album) {
      return (
        <div className={styles.wrapper}>
          <NavigationHistoryBar
            locations={[
              { name: 'Library', url: '/' },
              {
                name: album.artist.name,
                url: `/artist/${album.artist.id}`,
                icon: faUser
              },
              {
                name: album.title,
                url: `/album/${album.id}`,
                icon: faDotCircle
              }
            ]}
          />
          <div className={styles.albumWrapper}>
            <div className={styles.albumInfo}>
              <div className={styles.coverWrapper}>
                <AlbumCover
                  albumId={album.id}
                  className={styles.cover}
                  melHttpService={this.props.melHttpService}
                />
              </div>
              <h1 className={styles.albumTitle}>{this.state.album.title}</h1>
              {this._renderDownloadButton()}
            </div>
            <div className={styles.musicWrapper}>
              <h2>Tracks</h2>
              {this._renderTracks()}
            </div>
          </div>
        </div>
      )
    } else {
      return <div>Loading ...</div>
    }
  }

  _renderDownloadButton () {
    const { downloadService } = this.state

    let icon
    let text
    if (downloadService.containsAlbum(this.state.album)) {
      icon = faCheck
      text = 'In Downloads List'
    } else {
      icon = faDownload
      text = 'Add to Downloads'
    }
    return (
      <div className={styles.download} onClick={() => this._addToDownloads()}>
        <div className={styles.icon}>
          <FontAwesomeIcon icon={icon} />
        </div>
        <div>{text}</div>
      </div>
    )
  }

  _renderTracks () {
    let cdMap = new Map()
    this.state.album.tracks.forEach(track => {
      let caption = `Disc ${track.discNumber}`
      if (!cdMap.get(caption)) {
        cdMap.set(caption, [])
      }

      cdMap.get(caption).push(track)
    })

    let elements = []
    for (let [caption, tracks] of cdMap) {
      let captionLabel
      if (cdMap.size > 1) {
        captionLabel = <h3>{caption}</h3>
      }
      elements.push(
        <div key={caption} className={styles.discWrapper}>
          {captionLabel}
          {tracks.sort((a, b) => a.number - b.number).map(track => (
            <div key={track.id} className={styles.trackWrapper}>
              <div className={styles.number}>{track.number}</div>
              <div className={styles.title}>{track.title}</div>
            </div>
          ))}
        </div>
      )
    }

    return elements
  }
}
