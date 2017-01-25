import React, {Component} from 'react'
import {Link} from 'react-router'
import {connect} from 'react-redux'
import Helmet from 'react-helmet'
import {Checkbox, Card, CardText, CardTitle, Button} from 'react-toolbox'
import {Grid, Row, Col} from 'react-flexbox-grid'
import {addSubscription, removeSubscription} from 'redux/modules/info'
import {Loading, Warning} from 'components'
import style from './style'

@connect(
  (state) => ({
    info: state.info.data
  }),
  {addSubscription, removeSubscription}
)
export default class Innstillinger extends Component {

  handleChange = (field, value) => {
    if (value) {
      this.props.addSubscription(field)
    } else {
      this.props.removeSubscription(field)
    }
  }

  render () {
    const {roles, loadingSubscription, error} = this.props.info
    return (
      <Grid fluid>
        <Grid>
          <Helmet title='Innstillinger' />
          <Row>
            <Col xs={12}>
              <p className={style.buttonHolder}>
                <Link to='/'>
                  <Button label='Tilbake til forsiden' raised />
                </Link>
              </p>
              <h3 className={style.mainTitle}>Innstillinger for informasjon</h3>
              <Card className={style.card}>
                <CardTitle title={'Meldinger'} subtitle='Velg hvilke grupper du vil abonnere på meldinger fra' className={style.cardTitle} />
                <CardText>
                  {loadingSubscription && (
                    <Loading title='Lagrer innstillinger' />
                  )}
                  {error && (
                    <Warning title={error} />
                  )}
                  {roles && roles.map((item, i) => {
                    return (
                      <div key={i} className={style.fieldHolder}>
                        <Checkbox checked={item.subscription} label={item.name} disabled={item.required} onChange={this.handleChange.bind(this, item.id)} />
                      </div>
                    )
                  })}
                </CardText>
              </Card>
            </Col>
          </Row>
        </Grid>
      </Grid>
    )
  }
}
