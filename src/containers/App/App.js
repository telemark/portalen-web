import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {asyncConnect} from 'redux-connect'
import {isLoaded as isAuthLoaded, load as loadAuth} from 'redux/modules/auth'
import {push} from 'react-router-redux'
import {AppUser, AppGuest} from 'containers'
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
    user: state.auth.user
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
    pushState: PropTypes.func.isRequired
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.user && nextProps.user) {
      this.props.loadAuth().then(() => this.props.pushState('/'))
    } else if (this.props.user && !nextProps.user) {
      this.props.pushState('/authstatus')
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
