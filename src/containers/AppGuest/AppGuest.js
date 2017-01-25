import React, {Component, PropTypes} from 'react'

import style from './style'

export default class AppGuest extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired
  }

  render () {
    return (
      <div className={style.container}>
        {this.props.children}
      </div>
    )
  }
}
