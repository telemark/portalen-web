import React from 'react'
import style from './style'

const Warning = (props) => {
  return (
    <div className={style.box}>
      {props.title}
    </div>
  )
}

Warning.propTypes = {
  title: React.PropTypes.string
}

export default Warning
