import React from 'react'
import ProgressBar from 'react-toolbox/lib/progress_bar'
import style from './style'

const Loading = (props) => {
  return (
    <div className={style.box}>
      <p className={style.text}>{props.title}</p>
      <ProgressBar mode='indeterminate' />
    </div>
  )
}

Loading.propTypes = {
  title: React.PropTypes.string
}

export default Loading
