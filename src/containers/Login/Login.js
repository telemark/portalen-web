import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import Helmet from 'react-helmet'
import {login} from 'redux/modules/auth'
import {Card, CardTitle, CardText, CardActions, Button, Input} from 'react-toolbox'
import {Logo, Loading, Warning} from 'components'
import style from './style'

@connect(
  (state) => ({
    user: state.auth.user,
    error: state.auth.loginError,
    loading: state.auth.loggingIn
  }),
  {
    login
  }
)
export default class Login extends Component {
  static propTypes = {
    login: PropTypes.func.isRequired
  }

  state = {
    username: '',
    password: ''
  }

  componentDidMount () {
    if (this.refs.username) {
      document.querySelector('.username-field input').focus()
    }
  }

  handleChange = (name, value) => {
    this.setState({...this.state, [name]: value})
  }

  handleSubmit = (event) => {
    event.preventDefault()
    const {username, password} = this.state
    const {location: {query: {loginRedirect}}} = this.props
    this.props.login(username, password, loginRedirect)
  }

  render () {
    const {user, error, loading} = this.props
    return (
      <div>
        <p className={style.logoHolder}>
          <Logo className={style.logo} />
          <strong className={style.title}>Portalen</strong>
        </p>
        <form method='post' onSubmit={this.handleSubmit} className={style.container}>
          <Card>
            <Helmet title='Logg inn' />
            <CardTitle
              title='Logg inn'
              subtitle='Telemark fylkeskommune'
            />
            <CardText>
              {loading && (
                <Loading title='Logger inn' />
              )}
              {error && (
                <Warning title={error} />
              )}
              {user && (
                <p>Du er allerede logget inn som {user.cn}</p>
              )}
              {!user && (
                <div>
                  <Input type='text' ref='username' className='username-field' label='Brukernavn' name='username' value={this.state.username} onChange={this.handleChange.bind(this, 'username')} />
                  <Input type='password' label='Passord' name='password' value={this.state.password} onChange={this.handleChange.bind(this, 'password')} />
                </div>
              )}
            </CardText>
            <CardActions>
              {!user && (
                <Button className={style.button} label='Logg inn' type='submit' primary raised />
              )}
            </CardActions>
          </Card>
        </form>
      </div>
    )
  }
}
