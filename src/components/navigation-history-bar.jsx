import React from 'react'
import { Route, Link } from 'react-router-dom'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import FontAwesome from '@fortawesome/fontawesome'
import faAngleRight from '@fortawesome/fontawesome-free-solid/faAngleRight'
import style from './navigation-history-bar.sass'

export default class NavigationHistoryBar extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}

    this._gatherProps(props)
  }

  componentWillReceiveProps (newProps) {
    this._gatherProps(newProps)
    this.setState(this.state)
  }

  _gatherProps (props) {
    this.state.locations = props.locations
  }

  loadIcons () {
    FontAwesome.library.add(faAngleRight)
  }

  render () {
    if (this.state.locations) {
      return <div className={style.wrapper}>{this._renderLocations()}</div>
    } else {
      return <div />
    }
  }

  _renderLocations () {
    let elements = []
    for (let i = 0; i < this.state.locations.length; i++) {
      let location = this.state.locations[i]
      if (location.icon) {
        elements.push(
          <Link key={i} className={style.element} to={location.url}>
            <FontAwesomeIcon icon={location.icon} />
            <div>{location.name}</div>
          </Link>
        )
      } else {
        elements.push(
          <Link key={i} className={style.element} to={location.url}>
            {location.name}
          </Link>
        )
      }

      if (i + 1 !== this.state.locations.length) {
        elements.push(
          <div key={`splitter${i}`} className={style.splitter}>
            <FontAwesomeIcon icon={faAngleRight} />
          </div>
        )
      }
    }

    return elements
  }
}
