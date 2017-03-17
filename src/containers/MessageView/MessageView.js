import React, {Component} from 'react'
import {asyncConnect} from 'redux-connect'
import {Link} from 'react-router'
import Helmet from 'react-helmet'
import {connect} from 'react-redux'
import {Card, CardText, CardTitle} from 'react-toolbox/lib/card'
import Button from 'react-toolbox/lib/button'
import {Grid, Row, Col} from 'react-flexbox-grid'
import {isLoaded, load, reset} from 'redux/modules/message'
import ReactMarkdown from 'react-markdown'
import {Warning} from 'components'
import style from './style'
import moment from 'moment'
import 'moment/locale/nb.js'

@asyncConnect([{
  promise: ({
    store: {dispatch, getState},
    params: {id}
  }) => {
    const promises = []
    if (!isLoaded(getState())) {
      promises.push(dispatch(load(id)))
    }
    return Promise.all(promises)
  }
}])
@connect(
  (state) => ({
    error: state.message.error,
    item: state.message.item
  }),
  {
    reset
  }
)
export default class MessageView extends Component {
  componentWillUnmount () {
    this.props.reset()
  }

  render () {
    const {item, error} = this.props
    return (
      <Grid fluid>
        <Grid>
          {}
          <Helmet title={item.title} />
          <Row>
            <Col xs={12}>
              <p className={style.buttonHolder}>
                <Link to='/'>
                  <Button label='Tilbake til forsiden' raised />
                </Link>
              </p>
              {error && (
                <Warning title={error} />
              )}
              {!error && (
                <Card className={style.card}>
                  <CardTitle title={item.title} className={style.cardTitle} />
                  <CardText>
                    <p className={style.meta}>{moment(item.date_from).fromNow()} av {item.user.cn}</p>
                    <ReactMarkdown source={item.text} />
                  </CardText>
                </Card>
              )}
            </Col>
          </Row>
        </Grid>
      </Grid>
    )
  }
}
