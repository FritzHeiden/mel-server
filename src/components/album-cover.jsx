import React from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faDotCircle from '@fortawesome/fontawesome-free-solid/faDotCircle'

import styles from './album-cover.sass'

export default class AlbumCover extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.gatherProps(props)
  }

  gatherProps (props) {
    this.state.albumId = props.albumId
    this.state.melHttpService = props.melHttpService
    this.state.className = props.className
  }

  async loadCover () {
    const { albumId } = this.state
    const buffer = await this.state.melHttpService.getAlbumCover(albumId)
    this.state.cover = this.arrayBufferToBase64(buffer)
    this.setState(this.state)
  }

  arrayBufferToBase64 (buffer) {
    let binary = ''
    const bytes = new Uint8Array(buffer)
    const len = bytes.byteLength
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    console.log('data:image/png;base64,' + binary)
    return 'hello'
  }

  render () {
    const { albumId, className } = this.state
    const albumUrl = this.props.melHttpService.getAlbumCoverUrl(albumId)
    if (albumId) {
      return (
        <div
          className={[styles.cover, className].join(' ')}
          style={{ backgroundImage: `url('${albumUrl}')` }}
        />
      )
    } else {
      this.loadCover().catch(console.error)
      return (
        <div className={[styles.placeholder, className].join(' ')}>
          <FontAwesomeIcon icon={faDotCircle} />
        </div>
      )
    }
  }
}
