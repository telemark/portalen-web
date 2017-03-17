import React, {Component} from 'react'
import {connect} from 'react-redux'
import {load, reset} from 'redux/modules/search'
import Helmet from 'react-helmet'
import {Grid, Row, Col} from 'react-flexbox-grid'
import {Article, Loading, Warning} from 'components'
import Button from 'react-toolbox/lib/button'
import Navigation from 'react-toolbox/lib/navigation'
import {Link} from 'react-router'
import style from './style'

@connect(
  (state) => ({
    items: state.search.items,
    query: state.search.query,
    total: state.search.total,
    page: state.search.page,
    pages: state.search.pages,
    loading: state.search.loading,
    error: state.search.error
  }),
  {
    load,
    reset
  }
)
export default class Search extends Component {

  componentDidMount () {
    this.loadQuery()
  }

  componentWillUnmount () {
    this.props.reset()
  }

  componentDidUpdate (prevProps) {
    if (this.props.params.query !== prevProps.params.query || this.props.params.page !== prevProps.params.page) {
      this.props.reset()
      this.loadQuery()
    }
  }

  loadQuery () {
    const page = this.props.params.page || 1
    this.props.load(this.props.params.query, parseInt(page))
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
          title: item._source.title,
          text: `${item._source.data.positions[0].info} - ${item._source.description}`,
          url: item._source.url
        }
      default:
        return {
          title: item._source.title,
          text: item._source.description,
          url: item._source.url
        }
    }
  }

  renderNavigation () {
    const {query, total, page, pages} = this.props
    const thePages = Array.from({length: pages}, (v, k) => k + 1)
    return (
      <Navigation type='horizontal' className={style.navigation}>
        {(pages > 1) && thePages.map((p, i) => {
          return (
            <Link key={i} to={`/sok/${query}/${p}`} className={style.navigationItem}>
              <Button label={`${p}`} floating accent={p === page} mini />
            </Link>
          )
        })}
        <div className={style.info}>{`${total} treff på søkeordet "${query}", viser side ${page} av ${pages}.`}</div>
      </Navigation>
    )
  }

  render () {
    const {items, query, loading, error} = this.props
    return (
      <Grid fluid>
        <Grid>
          <Helmet title={`Søk: ${query}`} />
          <Row>
            <Col xs={12}>
              <h1>Søk: {query}</h1>
              {loading && (
                <Loading title={`Søker etter "${query}"..`} />
              )}
              {error && (
                <Warning title={error} />
              )}
              {items && (items.length > 0) && (
                <div>
                  {this.renderNavigation()}
                  {items.map((item, i) => {
                    return (
                      <Article key={i} {...this.formatType(item)} />
                    )
                  })}
                  {this.renderNavigation()}
                </div>
              )}
            </Col>
          </Row>
        </Grid>
      </Grid>
    )
  }
}
