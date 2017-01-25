import React from 'react'
import {Route} from 'react-router'
import {isLoaded as isAuthLoaded, load as loadAuth} from 'redux/modules/auth'
import {
    App,
    Home,
    Login,
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
      const {auth: { user }, routing: {locationBeforeTransitions: {pathname}}} = store.getState()
      if (!user) {
        replace({
          pathname: '/login',
          query: (pathname && pathname.length > 1) ? {loginRedirect: pathname} : null
        })
      }
      cb()
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
        <Route path='/sok/:query(/:page)' component={Search} />
        <Route path='/meldinger/:id' component={MessageView} />
      </Route>
      <Route path='/login' component={Login} />
      <Route path='*' component={NotFound} status={404} />
    </Route>
  )
}
