import React from 'react'
import {Card, CardText, CardTitle, CardActions, Button} from 'react-toolbox'
import style from './style'

const Article = (props) => {
  return (
    <Card className={style.card}>
      <CardTitle title={props.title} />
      <CardText>{props.text}</CardText>
      {props.url && (
        <CardActions className={style.cardActions}>
          <Button href={props.url} className={style.linkBtnFix} label='Les mer' />
        </CardActions>
      )}
    </Card>
  )
}

Article.propTypes = {
  title: React.PropTypes.string,
  subtitle: React.PropTypes.string,
  text: React.PropTypes.string,
  url: React.PropTypes.string
}

export default Article
