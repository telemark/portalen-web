import React from 'react'
import FontIcon from 'react-toolbox/lib/font_icon'
import {Card, CardText} from 'react-toolbox/lib/card'
import style from './style'

const CardLink = ({url, title, description, icon = 'link', className = ''}) => {
  const elInner = (
    <CardText className={style.item}>
      <FontIcon value={icon} />
      <h4 className={style.title}>{title}</h4>
      {description && <div className={style.description}>{description}</div>}
    </CardText>
  )
  return (
    <Card className={`${style.card} ${className}`}>
      {url && <a href={url} target='_blank' className={style.nolink}>{elInner}</a>}
      {!url && elInner}
    </Card>
  )
}

CardLink.propTypes = {
  icon: React.PropTypes.string,
  url: React.PropTypes.string,
  title: React.PropTypes.string,
  description: React.PropTypes.string
}

export default CardLink
