import React, {Component} from 'react'
import {connect} from 'react-redux'
import {asyncConnect} from 'redux-connect'
import Helmet from 'react-helmet'
import {Grid, Row, Col} from 'react-flexbox-grid'
import Button from 'react-toolbox/lib/button'
import Navigation from 'react-toolbox/lib/navigation'
import {Link} from 'react-router'
import omit from 'object.omit'

import {load, isLoaded, reset} from 'redux/modules/search'
import {Article, Warning} from 'components'
import config from 'config'
import style from './style'

const size = 20

@asyncConnect([{
  promise: ({store: {dispatch, getState}, location: {query}}) => {
    const promises = []
    const params = {
      ...query,
      from: query.from ? Math.max(parseInt(query.from), 1) : 1,
      size
    }
    if (query.phrase && query.phrase !== '' && !isLoaded(getState(), params)) {
      promises.push(dispatch(load(params)))
    }
    return Promise.all(promises)
  }
}])
@connect(
  (state) => ({
    search: state.search.data,
    loading: state.search.loading,
    error: state.search.error
  }),
  {
    load,
    reset
  }
)
export default class Search extends Component {
  componentWillUnmount () {
    if (!__DEVELOPMENT__) {
      this.props.reset()
    }
  }

  formatType (item) {
    switch (item._type) {
      case 'article':
        return {
          title: item._source.title,
          text: item._source.description,
          url: item._source.url
        }
      case 'employee':
        return {
          title: item._source.body.title,
          text: `${item._source.body.data.positions[0].info} - ${item._source.body.description}`,
          url: item._source.body.url
        }
      default:
        return {
          title: item._source.title,
          text: item._source.description,
          url: item._source.url
        }
    }
  }

  render () {
    const {location: {query: {phrase}}} = this.props
    const title = phrase ? `Søk: ${phrase}` : 'Søkeside'
    return (
      <Grid fluid>
        <Grid>
          <Helmet title={title} />
          <Row>
            <Col xs={12}>
              <h1>{title}</h1>
              {this.renderContent()}
            </Col>
          </Row>
        </Grid>
      </Grid>
    )
  }

  renderContent () {
    const {search, error} = this.props
    if (error) {
      return <Warning title={error} />
    }
    if (search && search.hits && search.hits.hits) {
      return this.renderResult()
    }
    return <p className={style.info}>Du har ennå ikke søkt etter noe</p>
  }

  renderResult () {
    const {search: {hits: {hits: items}}} = this.props
    const {searchOptions} = config
    return (
      <div>
        {searchOptions && this.renderFasets()}
        {this.renderNavigation(true)}
        {items.map((item, i) => <Article key={item._id || i} {...this.formatType(item)} />)}
        {this.renderNavigation()}
      </div>
    )
  }

  renderFasets () {
    const {searchOptions} = config
    const {location: {query, query: {faset}}} = this.props
    const selected = faset || searchOptions.default || ''
    return (
      <Navigation type='horizontal' className={style.navigation}>
        {searchOptions.fasets && searchOptions.fasets.map(({value, title}, i) => {
          const itemQuery = value === searchOptions.default ? omit(query, 'faset') : {...query, faset: value}
          return (
            <Link key={i} to={{pathname: '/sok', query: omit(itemQuery, 'from')}} className={style.navigationItem}><Button raised accent={value === selected} mini>{title}</Button></Link>
          )
        })}
      </Navigation>
    )
  }

  renderNavigation (showInfo = false) {
    const {search: {hits: {total}}, location: {query, query: {phrase, from = '1'}}} = this.props
    const numPages = Math.max(1, Math.ceil(total / size))
    const thePages = Array.from({length: numPages}, (v, k) => `${k + 1}`)
    const showPagination = numPages > 1
    return (
      <div>
        {showPagination && (
          <Navigation type='horizontal' className={style.navigation}>
            {thePages.map((page) => <Link key={page} to={{pathname: '/sok', query: {...query, from: page}}} className={style.navigationItem}><Button floating accent={page === from} mini>{page}</Button></Link>)}
          </Navigation>
        )}
        {showInfo && <p className={style.info}>{`${total} treff på søkeordet "${phrase}", viser side ${from} av ${numPages}.`}</p>}
      </div>
    )
  }
}
