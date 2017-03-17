import React, {Component} from 'react'
import {connect} from 'react-redux'
import {add, reset} from 'redux/modules/feedback'
import {Link} from 'react-router'
import Helmet from 'react-helmet'
import {Card, CardText, CardTitle} from 'react-toolbox/lib/card'
import Button from 'react-toolbox/lib/button'
import Input from 'react-toolbox/lib/input'
import {Loading, Warning} from 'components'
import {Grid, Row, Col} from 'react-flexbox-grid'
import style from './style'

const defaultMessage = {
  title: '',
  body: ''
}

@connect(
  (state) => ({
    successMessage: state.feedback.successMessage,
    loading: state.feedback.loading,
    error: state.feedback.error,
    user: state.auth.user
  }),
  {
    add, reset
  }
)
export default class Tilbakemeldinger extends Component {
  state = {
    message: {...defaultMessage}
  }

  componentWillUnmount () {
    this.props.reset()
  }

  handleChange = (field, value) => {
    this.setState({message: {...this.state.message, [field]: value}})
  }

  handleSubmit () {
    this.props.add(Object.assign({}, this.state.message, {body: `${this.state.message.body}\n\n${this.props.user.cn}`}))
    .then(() => {
      this.setState({message: {...defaultMessage}})
    })
  }

  render () {
    const {loading, error, successMessage} = this.props
    return (
      <Grid fluid>
        <Grid>
          <Helmet title='Tilbakemeldinger' />
          <Row>
            <Col xs={12}>
              <p className={style.buttonHolder}>
                <Link to='/'>
                  <Button label='Tilbake til forsiden' raised />
                </Link>
              </p>
              <Card className={style.card}>
                <CardTitle title={'Tilbakemeldingskjema'} subtitle='Send oss en tilbakemelding så vi kan gjøre Portalen bedre!' className={style.cardTitle} />
                <CardText>
                  {loading && (
                    <Loading title='Sender inn tilbakemelding' />
                  )}
                  {error && (
                    <Warning title={error} />
                  )}
                  {successMessage && (
                    <p>{successMessage}</p>
                  )}
                  {!successMessage && (
                    <div>
                      <Input type='text' label='Tittel' value={this.state.message.title} onChange={this.handleChange.bind(this, 'title')} required />
                      <Input type='text' label='Beskrivelse' multiline value={this.state.message.body} onChange={this.handleChange.bind(this, 'body')} required />
                      <Button label='Send tilbakemelding' raised primary onClick={this.handleSubmit.bind(this)} />
                    </div>
                  )}
                </CardText>
              </Card>
            </Col>
          </Row>
        </Grid>
      </Grid>
    )
  }
}
