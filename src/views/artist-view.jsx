import React from 'react'
import { Link } from 'react-router-dom'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import FontAwesome from '@fortawesome/fontawesome'
import faUser from '@fortawesome/fontawesome-free-solid/faUser'
import faDotCircle from '@fortawesome/fontawesome-free-solid/faDotCircle'
import { Artist } from 'mel-core'
import NavigationHistoryBar from '../components/navigation-history-bar'
import styles from './artist-view.sass'
import AlbumCover from '../components/album-cover'

export default class ArtistView extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
    this._gatherProps(props)
    this._loadArtist()
    this.loadIcons()
  }

  componentWillReceiveProps (newProps) {
    this._gatherProps(newProps)
    this._loadArtist()
  }

  _gatherProps (props) {
    this.state.melClientSocket = props.melClientSocket
    this.state.melHttpService = props.melHttpService
    this.state.artist = new Artist(props.match.params.artistId)
  }

  loadIcons () {
    FontAwesome.library.add(faUser)
    FontAwesome.library.add(faDotCircle)
  }

  async _loadArtist () {
    let artist = await this.state.melClientSocket.getArtist(
      this.state.artist.id
    )
    let albums = []
    for (let album of artist.albums) {
      albums.push(await this.state.melClientSocket.getAlbum(album.id))
    }
    artist.albums = albums
    let featureAlbums = []
    for (let album of artist.featureAlbums) {
      featureAlbums.push(await this.state.melClientSocket.getAlbum(album.id))
    }
    artist.featureAlbums = featureAlbums
    this.state.artist = artist
    this.setState(this.state)
  }

  render () {
    if (this.state.artist) {
      return (
        <div className={styles.wrapper}>
          <NavigationHistoryBar
            locations={[
              { name: 'Library', url: '/' },
              {
                name: this.state.artist.name,
                url: `/artist/${this.state.artist.id}`,
                icon: faUser
              }
            ]}
          />
          <div className={styles.artistWrapper}>
            <div className={styles.artistInfo}>
              <div className={styles.thumbWrapper}>
                <div className={styles.placeholder}>
                  <FontAwesomeIcon icon={faUser} />
                </div>
                <div className={styles.thumb} />
              </div>
              <h1>{this.state.artist.name}</h1>
            </div>
            <div className={styles.musicWrapper}>
              <h2>Albums</h2>
              <div className={styles.albumsWrapper}>
                {this._renderAlbumList(this.state.artist.albums)}
              </div>
              <h2>Appears on</h2>
              <div className={styles.albumsWrapper}>
                {this._renderAlbumList(this.state.artist.featureAlbums)}
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return <div>Loading ...</div>
    }
  }

  _renderAlbumList (albums) {
    const { melHttpService } = this.state
    return albums.sort((a, b) => b.year - a.year).map(album => (
      <Link
        key={album.id}
        className={styles.albumWrapper}
        to={{ pathname: '/album/' + album.id }}
      >
        <div className={styles.coverWrapper}>
          <AlbumCover
            className={styles.cover}
            albumId={album.id}
            melHttpService={melHttpService}
          />
          {/* <div className={styles.cover} style={{backgroundImage: `url(${album.coverUrl})`}}/> */}
        </div>
        <div className={styles.title}>{album.title}</div>
        <div className={styles.year}>{album.year}</div>
      </Link>
    ))
  }
}
