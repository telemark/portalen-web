import React, {Component} from 'react'
import Helmet from 'react-helmet'
import {Grid, Row, Col} from 'react-flexbox-grid'

export default class Hjelp extends Component {
  render () {
    return (
      <Grid>
        <Helmet title='Hjelp' />
        <Row>
          <Col xs={12}>
            <h1>Hjelp</h1>
          </Col>
        </Row>
      </Grid>
    )
  }
}
