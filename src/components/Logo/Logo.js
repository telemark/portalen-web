import React from 'react'
import style from './style'
import file from './logo.svg'

const Logo = (props) => {
  let className = style.logo
  if (props.className) className += ` ${props.className}`

  return (
    <img src={file} className={className} />
  )
}

Logo.propTypes = {
  className: React.PropTypes.string
}

export default Logo
