import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router'
import Nes from 'nes'
import {Layout, NavDrawer, Panel} from 'react-toolbox/lib/layout'
import AppBar from 'react-toolbox/lib/app_bar'
import {IconButton, Button} from 'react-toolbox/lib/button'
import Input from 'react-toolbox/lib/input'
import {IconMenu, MenuItem, MenuDivider} from 'react-toolbox/lib/menu'
import Dialog from 'react-toolbox/lib/dialog'

import {logout} from 'redux/modules/auth'
import {load as loadInfo, addUrl, editUrl, removeUrl, updateExternal as updateExternalInfo} from 'redux/modules/info'
import {load as loadMessages, updateExternal as updateExternalMessage, removeExternal as removeExternalMessage} from 'redux/modules/messages'
import {Logo, Sidebar, Warning} from 'components'
import validUrl from 'valid-url'
import config from '../../config'
import style from './style'
import {push} from 'react-router-redux'

@connect(
  (state) => ({
    user: state.auth.user,
    info: state.info.data,
    query: state.search.query
  }),
  {
    logout,
    pushState: push,
    addUrl,
    editUrl,
    removeUrl,
    loadInfo,
    updateExternalMessage,
    removeExternalMessage,
    loadMessages,
    updateExternalInfo
  }
)
export default class AppUser extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object,
    info: PropTypes.object,
    logout: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired
  }

  state = {
    drawerActive: false,
    drawerPinned: false,
    searchVisible: false,
    dialogActive: false,
    query: '',
    url: {}
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.query !== nextProps.query) {
      this.setState({
        query: nextProps.query,
        searchVisible: nextProps.query ? nextProps.query.length > 0 : false
      })
    }
    if (!this.props.info.roles && nextProps.info.roles) {
      this.props.loadMessages(this.subscriptionRoles(nextProps))
    }
    if (this.props.info.roles && this.props.user && this.props.user.token && !this.nesclient) {
      this.initWebSocket()
    }
    if (this.props.user && !nextProps.user && this.nesclient) {
      this.nesclient.disconnect()
    }
  }

  subscriptionRoles (props) {
    const {info: {roles}} = props
    return roles ? roles.filter((role) => role.subscription).map((role) => role.id) : []
  }

  initWebSocket () {
    const {user: {token}} = this.props
    this.nesclient = new Nes.Client(`${config.wsFullUrl}`)
    this.nesclient.connect({
      auth: {
        headers: {
          cookie: token
        }
      }
    }, (err) => {
      if (err) {
        console.log(err)
      }
      this.subscriptionRoles(this.props).forEach((role) => {
        this.nesclient.subscribe(`/messageupdates/${role}`, this.socketListenerMessages, this.socketErrorHandler)
      })
      this.nesclient.subscribe('/tasksupdates', this.socketListenerTasks, this.socketErrorHandler)
      this.nesclient.subscribe('/contentupdates', this.socketListenerContent, this.socketErrorHandler)
    })
  }

  socketErrorHandler (error) {
    error && console.log('socketErrorHandler', error)
  }

  socketListenerMessages = (update) => {
    if (update.deleted) {
      this.props.removeExternalMessage(update.deleted)
    } else {
      this.props.updateExternalMessage(update)
    }
  }

  socketListenerTasks = (update) => {
    this.props.updateExternalInfo('tasks', update)
  }

  socketListenerContent = (update) => {
    update.ads && this.props.updateExternalInfo('ads', update.ads)
    update.news && this.props.updateExternalInfo('news', update.news)
  }

  componentDidMount () {
    const {info} = this.props
    const infoTypes = ['links', 'roles', 'shortcuts', 'tasks', 'ads', 'news', 'urls']
    infoTypes.forEach((type) => {
      if (!info[type]) {
        this.props.loadInfo(type)
      }
    })
  }

  toggleDrawerActive = () => {
    this.setState({ drawerActive: !this.state.drawerActive })
  }

  toggleSearchVisible = () => {
    const {query} = this.state
    if (query && query.length > 0) {
      this.performSearch()
    } else {
      this.setState({ searchVisible: !this.state.searchVisible, drawerActive: false, dialogActive: false }, () => {
        if (this.state.searchVisible) {
          document.querySelector('.site-search input').focus()
        }
      })
    }
  }

  handleChange = (name, value) => {
    this.setState({...this.state, [name]: value})
  }

  handleSubmit = (event) => {
    event.preventDefault()
    this.performSearch()
  }

  performSearch () {
    const {query} = this.state
    this.setState({
      searchVisible: false
    }, () => this.props.pushState(`/sok/${query}`))
  }

  /* Urls */

  handleNewUrlToggle = () => {
    this.setState({
      dialogActive: !this.state.dialogActive,
      drawerActive: true,
      urlError: null,
      url: {
        title: '',
        url: ''
      }
    })
  }

  handleEditUrl = (item) => {
    this.setState({
      dialogActive: true,
      url: item
    })
  }

  handleSaveUrl = () => {
    if (this.state.url.title.length < 1) {
      return this.setState({urlError: 'Du må fylle ut en tittel'})
    }
    if (!validUrl.isUri(this.state.url.url)) {
      return this.setState({urlError: 'Dette er ikke en gyldig url'})
    }
    if (this.state.url._id) {
      this.props.editUrl(this.state.url._id, {
        ...this.state.url
      })
    } else {
      this.props.addUrl({
        ...this.state.url
      })
    }
    this.handleNewUrlToggle()
  }

  handleUrlChange = (item, value) => {
    this.setState({
      url: {...this.state.url, [item]: value}
    })
  }

  handleRemoveUrl = (item) => {
    this.props.removeUrl(item._id)
  }

  renderLightbox () {
    const actions = [
      {
        label: 'Avbryt',
        onClick: this.handleNewUrlToggle
      },
      {
        label: 'Lagre',
        onClick: this.handleSaveUrl
      }
    ]
    return (
      <Dialog
        actions={actions}
        active={this.state.dialogActive}
        onEscKeyDown={this.handleToggle}
        onOverlayClick={this.handleToggle}
        title={this.state.url._id ? 'Endre url' : 'Ny url'}
      >
        {this.state.urlError && (
          <Warning title={this.state.urlError} />
        )}
        <Input type='text' label='Tittel' value={this.state.url.title} onChange={this.handleUrlChange.bind(this, 'title')} />
        <Input type='text' label='Url' value={this.state.url.url} onChange={this.handleUrlChange.bind(this, 'url')} />
      </Dialog>
    )
  }

  render () {
    return (
      <div className={style.container}>
        {this.renderHeader()}
        <Layout className={style.layout}>
          {this.renderSidebar()}
          <Panel>
            <div className={style.panel}>
              {this.props.children}
            </div>
          </Panel>
        </Layout>
      </div>
    )
  }

  renderSidebar () {
    const {info: {links, urls}} = this.props
    return (
      <NavDrawer active={this.state.drawerActive} permanentAt='xxxl' onOverlayClick={this.toggleDrawerActive}>
        <div className={style.sidebar}>
          {links && <Sidebar items={links} />}
          {urls && <Sidebar items={urls} editAction={this.handleEditUrl} removeAction={this.handleRemoveUrl} />}
          {urls && <Button label='Legg til lenke' icon='add' onClick={this.handleNewUrlToggle} />}
          {this.renderLightbox()}
        </div>
      </NavDrawer>
    )
  }

  handleOnMenuSelect = (value) => {
    this.setState({
      drawerActive: false,
      drawerPinned: false,
      searchVisible: false,
      dialogActive: false
    }, () => {
      if (value === 'innstillinger') {
        this.props.pushState('/innstillinger')
      }
      if (value === 'tilbakemeldinger') {
        this.props.pushState('/tilbakemeldinger')
      }
      if (value === 'logout') {
        this.props.logout()
      }
    })
  }

  renderHeader () {
    const {info: {links, urls}} = this.props
    const {searchVisible} = this.state
    return (
      <AppBar className={style.appbar}>
        <div className={searchVisible ? style.headerHolderSearch : style.headerHolder}>
          {(links || urls) && (
            <IconButton icon='menu' onClick={this.toggleDrawerActive} />
          )}
          <Link to='/' className={style.logoHolder}>
            <Logo className={style.logo} />
            <span className={style.logoText}>{config.app.title}</span>
          </Link>
          <div className={style.navigation}>
            {(searchVisible || this.state.query) && (
              <form onSubmit={this.handleSubmit} className={style.form}>
                <div className='site-search'>
                  <Input className={style.searchInput} type='text' label='Søk' value={this.state.query} onChange={this.handleChange.bind(this, 'query')} />
                </div>
              </form>
            )}
            <IconButton icon='search' onClick={this.toggleSearchVisible} />
            <IconMenu icon='more_vert' position='topRight' className={style.menu} menuRipple onSelect={this.handleOnMenuSelect}>
              <MenuItem value='tilbakemeldinger' key='tilbakemeldinger' icon='feedback' caption='Tilbakemeldinger' />
              <MenuItem value='innstillinger' key='settings' icon='settings' caption='Innstillinger' />
              <MenuDivider />
              <MenuItem value='logout' key='account_circle' icon='account_circle' caption='Logg ut' />
            </IconMenu>
          </div>
        </div>
      </AppBar>
    )
  }
}
