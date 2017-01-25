import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {asyncConnect} from 'redux-connect'
import {isLoaded as isAuthLoaded, load as loadAuth} from 'redux/modules/auth'
import {push} from 'react-router-redux'
import {AppUser, AppGuest} from 'containers'
import 'react-toolbox/lib/commons'
import './style'

@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => {
    const promises = []
    if (!isAuthLoaded(getState())) {
      promises.push(dispatch(loadAuth()))
    }
    return Promise.all(promises)
  }
}])
@connect(
  (state) => ({
    user: state.auth.user,
    redirect: state.auth.redirect
  }),
  {
    pushState: push,
    loadAuth
  }
)
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object,
    pushState: PropTypes.func.isRequired,
    redirect: PropTypes.string
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.user && nextProps.user) {
      this.props.loadAuth().then(() => nextProps.redirect && this.props.pushState(nextProps.redirect))
    } else if (this.props.user && !nextProps.user) {
      this.props.pushState('/login')
    }
  }

  render () {
    if (this.props.user) {
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
