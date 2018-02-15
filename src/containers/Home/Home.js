import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import Helmet from 'react-helmet'
import {Grid, Row, Col} from 'react-flexbox-grid'
import {Card, CardText, CardTitle, CardActions} from 'react-toolbox/lib/card'
import {List, ListItem} from 'react-toolbox/lib/list'
import {Button, IconButton} from 'react-toolbox/lib/button'
import FontIcon from 'react-toolbox/lib/font_icon'
import Snackbar from 'react-toolbox/lib/snackbar'

import {Messages} from 'containers'
import {CardLink} from 'components'
import {removeContent, dismissError} from 'redux/modules/info'
import style from './style'
import taskIconMapper from '../../../utils/tasks-icon-mapper'

class ErrorSnackBar extends Component {
  dismiss = () => {
    this.props.dismiss(this.props.infoType)
  }
  render () {
    const {error, active} = this.props
    return (
      <Snackbar action='Dismiss' active={active} label={error} timeout={3000} type='cancel' onClick={this.dismiss} onTimeout={this.dismiss} />
    )
  }
}

@connect(
  (state) => ({
    info: state.info.data,
    errors: state.info.errors,
    user: state.auth.user
  }),
  {
    removeContent,
    dismissError
  }
)
export default class Home extends Component {
  static propTypes = {
    info: PropTypes.object
  }

  renderShortcuts () {
    const {info: {shortcuts}} = this.props
    return (
      <Row className={style.equelHeightRow}>
        {shortcuts && shortcuts.map((item, i) => {
          return (
            <Col xs={6} sm={4} md={2} key={i} className={style.equelHeightCol}>
              <CardLink {...item} />
            </Col>
          )
        })}
        {!shortcuts && (
          <Col xs={6} sm={4} md={2} className={style.equelHeightCol}>
            <CardLink title='Snarveier' description='Laster inn…' className={style.loadingState} />
          </Col>
        )}
      </Row>
    )
  }

  renderTasks () {
    const {info: {tasks}} = this.props
    return (
      <Card className={`${style.card} ${tasks ? '' : style.loadingState}`}>
        <CardTitle title={'Dine oppgaver'} className={style.cardTitle} />
        {tasks && tasks.length > 0 && (
          <List className={style.cardList}>
            {tasks.length > 0 && tasks.map((item, i) => {
              const itemIcon = taskIconMapper(item.systemid)
              return (
                <ListItem key={i} caption={item.title} leftIcon={itemIcon} to={item.url} />
              )
            })}
          </List>
        )}
        {tasks && tasks.length < 1 && (
          <List className={style.cardList}>
            <ListItem caption='Du har ingen oppgaver' leftIcon={'tag_faces'} />
          </List>
        )}
        {!tasks && (
          <List className={style.cardList}>
            <ListItem caption='Henter oppgaver…' />
          </List>
        )}
      </Card>
    )
  }

  removeItem (set, key) {
    this.props.removeContent(set, key)
  }

  renderRemoveBtn (set, key) {
    return (
      <IconButton icon='visibility_off' accent onClick={this.removeItem.bind(this, set, key)} />
    )
  }

  renderAds () {
    const {info: {ads}} = this.props
    return (
      <div>
        {ads && ads.map((item, i) => {
          const content = (item.matrixData && item.matrixData.length > 0 && item.matrixData[0].htmlContent) ? item.matrixData[0].htmlContent : item.description
          return (
            <Card key={i} className={style.card}>
              <div className={style.withRemove}>
                <div className={style.removeContainer}>
                  {this.renderRemoveBtn('ads', item.url)}
                </div>
                <div className={style.htmlContentAd} dangerouslySetInnerHTML={{__html: content}} />
              </div>
            </Card>
          )
        })}
      </div>
    )
  }

  renderNews () {
    const {info: {news}} = this.props
    return (
      <div>
        {news && news.map((item, i) => {
          return (
            <Card key={i} className={style.card}>
              <CardText className={style.cardTextEqualHeight}>
                <h4 className={style.newstitle}>{item.title}</h4>
                <div className={style.htmlContent} dangerouslySetInnerHTML={{__html: item.summary}} />
              </CardText>
              <CardActions className={style.cardActions}>
                <Button href={item.url} label='Les mer' className={style.linkBtnFix} />
                {this.renderRemoveBtn('news', item.url)}
              </CardActions>
            </Card>
          )
        })}
        {!news && (
          <Card className={`${style.card} ${style.loadingState}`}>
            <CardText className={style.cardTextEqualHeight}>
              <h4 className={style.newstitle}>Nyheter</h4>
              <div className={style.placeholderImage}>
                <FontIcon value='photo' className={style.icon} />
              </div>
              <p>Laster inn</p>
            </CardText>
          </Card>
        )}
      </div>
    )
  }

  render () {
    const {user, info: {roles}, errors, dismissError} = this.props
    const activeErrors = errors.filter((item) => item.active)
    const errorToShow = activeErrors.length > 0 ? activeErrors[0] : errors.length > 0 ? errors[errors.length - 1] : null
    return (
      <Grid fluid>
        <Helmet title='Forsiden' />
        {this.renderShortcuts()}
        <Row className={style.xsreverse}>
          <Col xs={12} sm={6}>
            {this.renderTasks()}
            <Card className={style.card}>
              {user && user.token && roles && <Messages />}
            </Card>
          </Col>
          <Col xs={12} sm={6}>
            {this.renderAds()}
            {this.renderNews()}
          </Col>
        </Row>
        {errorToShow && <ErrorSnackBar {...errorToShow} dismiss={dismissError} />}
      </Grid>
    )
  }
}
