import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {asyncConnect} from 'redux-connect'
import {isLoaded as isAuthLoaded, load as loadAuth} from 'redux/modules/auth'
import {push, replace} from 'react-router-redux'
import {AppUser, AppGuest} from 'containers'
import './style'

@asyncConnect([{
  promise: ({store: {dispatch, getState}, location: {query: {jwt}}}) => {
    const promises = []
    if (!isAuthLoaded(getState())) {
      promises.push(dispatch(loadAuth(jwt)))
    }
    return Promise.all(promises)
  }
}])
@connect(
  (state) => ({
    user: state.auth.user
  }),
  {
    push,
    replace,
    loadAuth
  }
)
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object,
    push: PropTypes.func.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  componentDidMount () {
    const {replace, location: {query: {jwt}}} = this.props
    if (jwt) {
      replace('/')
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.user && !nextProps.user) {
      this.props.push('/authstatus')
    }
  }

  render () {
    if (this.props.user && this.props.user.token) {
      return (
        <AppUser>
          {this.props.children}
        </AppUser>
      )
    } else {
      return (
        <AppGuest>
          {this.props.children}
        </AppGuest>
      )
    }
  }
}
