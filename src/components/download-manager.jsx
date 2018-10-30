import React from 'react'
import FontAwesome from '@fortawesome/fontawesome'
import faTimes from '@fortawesome/fontawesome-free-solid/faTimes'
import faListUl from '@fortawesome/fontawesome-free-solid/faListUl'
import faDownload from '@fortawesome/fontawesome-free-solid/faDownload'

import styles from './download-manager.sass'
import DownloadService from '../services/download-service'
import Button from './general/button'

const MINIMIZED = 1
const MAXIMIZED = 2

class DownloadManager extends React.Component {
  constructor (props) {
    super(props)

    this.state = {}
    const downloadService = DownloadService.getInstance()
    downloadService.addOnDownloadListChangedListener(artists => {
      this.state.artists = artists
      this.setState(this.state)
    })
    downloadService.addOnTotalSizeChangedListener(totalSize => {
      this.state.totalSize = totalSize
      this.setState(this.state)
    })
    downloadService.addOnStateChangedListener(state => {
      this.state.downloadState = state
      this.setState(this.state)
    })
    downloadService.addOnCurrentTrackChangedListener(track => {
      if (track) {
        this.state.currentTrack = track
        this.setState(this.state)
      }
    })
    this.state.downloadService = downloadService
    this.state.downloadState = downloadService.getState()
    this.state.totalSize = downloadService.getTotalSize()
    this._gatherProps(props)
    this.loadIcons()
  }

  componentWillReceiveProps (newProps) {
    this._gatherProps(newProps)
  }

  _gatherProps (props) {
    this.state.state = props.state
  }

  loadIcons () {
    FontAwesome.library.add(faTimes)
    FontAwesome.library.add(faListUl)
    FontAwesome.library.add(faDownload)
  }

  _onDownloadListChanged (artists) {}

  render () {
    if (!this.state.artists || this.state.artists.length === 0) {
      return this._renderHidden()
    } else {
      if (this.state.state === MAXIMIZED) {
        return this._renderMinimized()
      } else {
        return this._renderMinimized()
      }
    }
  }

  _renderMinimized () {
    const { downloadService, totalSize, downloadState } = this.state

    let text = ''

    switch (downloadState) {
      case DownloadService.PENDING:
        text = this.textPending()
        break
      case DownloadService.DOWNLOADING:
        text = this.textDownloading()
        break
      case DownloadService.ZIPPING:
        text = 'Compressing files ...'
        break
      case DownloadService.DONE:
        text = 'Download successful!'
        break
    }

    return (
      <div className={styles.wrapper + ' ' + styles.minimized}>
        <div className={styles.text}>{text}</div>
        <Button
          className={styles.button}
          icon={faTimes}
          label={'Discard'}
          onClick={() => downloadService.deleteList()}
        />
        <Button className={styles.button} icon={faListUl} label={'Open List'} />
        <Button
          className={styles.button}
          icon={faDownload}
          label={'Download'}
          accent
          onClick={() => downloadService.startDownload()}
        />
      </div>
    )
  }

  textPending () {
    const { totalSize } = this.state
    let artistCount = 0
    let albumCount = 0
    let trackCount = 0

    for (let artist of this.state.artists) {
      artistCount++
      for (let album of artist.albums) {
        albumCount++
        for (let track of album.tracks) {
          trackCount++
        }
      }
    }

    return (
      `${artistCount} Artists, ` +
      `${albumCount} Albums, ` +
      `${trackCount} Tracks selected for download. ` +
      `(${this._formatSize(totalSize)})`
    )
  }

  textDownloading () {
    const { currentTrack } = this.state
    return `Downloading ${currentTrack.title} ...`
  }

  _formatSize (size) {
    const KB = 1000
    const MB = 1000000
    const GB = 1000000000
    if (size < MB) {
      return String(Math.floor(size / KB * 100) / 100) + ' KB'
    } else if (size < GB) {
      return String(Math.floor(size / MB * 100) / 100) + ' MB'
    } else {
      return String(Math.floor(size / GB * 100) / 100) + ' GB'
    }
  }

  _renderHidden () {
    return <div className={styles.wrapper + ' ' + styles.hidden} />
  }
}

DownloadManager.MINIMIZED = MINIMIZED
DownloadManager.MAXIMIZED = MAXIMIZED

export default DownloadManager
