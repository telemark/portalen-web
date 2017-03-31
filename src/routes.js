import React from 'react'
import {Route} from 'react-router'
import {isLoaded as isAuthLoaded, load as loadAuth} from 'redux/modules/auth'
import {
    App,
    Home,
    AuthStatus,
    NotFound,
    Tilbakemeldinger,
    Hjelp,
    Innstillinger,
    Search,
    MessageView
} from 'containers'

export default (store) => {
  const requireLogin = (nextState, replace, cb) => {
    function checkAuth () {
      const {auth: { user }} = store.getState()
      if (!user) {
        if (__SERVER__) {
          replace({
            pathname: '/reauth'
          })
          cb()
        } else {
          global.location.href = '/reauth'
        }
      } else {
        cb()
      }
    }

    if (!isAuthLoaded(store.getState())) {
      store.dispatch(loadAuth()).then(checkAuth)
      .catch(checkAuth)
    } else {
      checkAuth()
    }
  }

  return (
    <Route component={App}>
      <Route onEnter={requireLogin}>
        <Route path='/' component={Home} />
        <Route path='/tilbakemeldinger' component={Tilbakemeldinger} />
        <Route path='/hjelp' component={Hjelp} />
        <Route path='/innstillinger' component={Innstillinger} />
        <Route path='/sok' component={Search} />
        <Route path='/meldinger/:id' component={MessageView} />
      </Route>
      <Route path='/authstatus' component={AuthStatus} />
      <Route path='*' component={NotFound} status={404} />
    </Route>
  )
}
