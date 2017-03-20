import React, {Component} from 'react'
import {connect} from 'react-redux'
import Helmet from 'react-helmet'
import {Link} from 'react-router'
import {login} from 'redux/modules/auth'
import {Card, CardText, CardTitle, CardActions} from 'react-toolbox/lib/card'
import Button from 'react-toolbox/lib/button'
import {Logo, Warning} from 'components'
import style from './style'

@connect(
  (state) => ({
    user: state.auth.user,
    error: state.auth.loginError
  }),
  {
    login
  }
)
export default class authstatus extends Component {
  componentDidMount () {
    const {login, user, location: {query: {jwt}}} = this.props
    if (jwt && !user) {
      return login(jwt)
    }
  }
  render () {
    const {user, error, location: {query: {jwt}}} = this.props
    const title = jwt ? 'Logger inn..' : user ? 'Du er logget inn' : 'Du er logget ut'
    return (
      <div>
        <p className={style.logoHolder}>
          <Logo className={style.logo} />
          <strong className={style.title}>Portalen</strong>
        </p>
        <div className={style.container}>
          <Card>
            <Helmet title={title} />
            <CardTitle
              title={title}
              subtitle='Telemark fylkeskommune'
            />
            <CardText>
              {error && <Warning title={error} />}
              {user && <p>Du er allerede logget inn som {user.cn}</p>}
              {!user && <p>Ønsker du å logge inn på nytt kan du gjøre det.</p>}
            </CardText>
            <CardActions>
              {user && <Link to='/' className={style.link}><Button className={style.button} label='Til forsiden' primary raised /></Link>}
              {!user && <Button className={style.button} label='Logg inn på nytt' href='/' primary raised />}
            </CardActions>
          </Card>
        </div>
      </div>
    )
  }
}
