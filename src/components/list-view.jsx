import React from 'react'
import style from './list-view.sass'

export default class ListView extends React.Component {
  renderItem (item, index) {
    return (
      <div key={index} className='item'>
        {item}
      </div>
    )
  }

  renderItems () {
    if (this.props.children.map) {
      return this.props.children.map((child, index) =>
        this.renderItem(child, index)
      )
    } else {
      return this.renderItem(this.props.children, 0)
    }
  }

  render () {
    let name = 'list-view'
    if (this.props.className) {
      name += ' ' + this.props.className
    }
    return <div className={name}>{this.renderItems()}</div>
  }
}
