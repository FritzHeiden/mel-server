import React from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import style from './button.sass'

export default class Button extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
    this.state.label = props.label
  }

  componentWillReceiveProps (newProps) {
    this.state.label = newProps.label
    this.setState(this.state)
  }

  _handleClick () {
    if (!this.props.disabled && this.props.onClick) {
      this.props.onClick()
    }
  }

  render () {
    let buttonStyle = style.button + ' ' + this.props.className
    if (this.props.accent) {
      buttonStyle += ' '
      buttonStyle += style.accent
      if (this.props.disabled) {
        buttonStyle += ' '
        buttonStyle += style.accentDisabled
      }
    } else {
      buttonStyle += ' '
      buttonStyle += style.generic
      if (this.props.disabled) {
        buttonStyle += ' '
        buttonStyle += style.genericDisabled
      }
    }
    return (
      <div onClick={() => this._handleClick()} className={buttonStyle}>
        {this._renderIcon()}
        {this._renderSpacer()}
        {this.state.label}
      </div>
    )
  }

  _renderIcon () {
    if (this.props.icon) {
      return <FontAwesomeIcon icon={this.props.icon} />
    }
  }

  _renderSpacer () {
    if (this.props.icon && this.props.label && this.props.label !== '') {
      return <div className={style.spacer} />
    }
  }
}
