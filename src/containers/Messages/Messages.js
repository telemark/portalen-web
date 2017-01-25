import React, {Component, PropTypes} from 'react'
import {connect} from 'react-redux'
import {add, edit, remove, like, unlike, loadnext, hide} from 'redux/modules/messages'
import {List, ListItem, ListDivider, Button, IconButton, IconMenu, MenuItem, Dialog, Input, DatePicker, CardTitle, Autocomplete} from 'react-toolbox'
import {Row, Col} from 'react-flexbox-grid'
import ReactMarkdown from 'react-markdown'
import style from './style'
import moment from 'moment'
import 'moment/locale/nb.js'
import pick from 'object.pick'
import {Warning} from 'components'
import {push} from 'react-router-redux'
import defaultMessage from 'helpers/defaultMessage'

var RichTextEditor
if (__CLIENT__) {
  RichTextEditor = require('react-rte').default
}

@connect(
  (state) => ({
    loaded: state.messages.loaded,
    error: state.messages.error,
    moreEnabled: state.messages.moreEnabled,
    items: state.auth.user ? state.messages.items.filter((item) => !item.hidefor.find((user) => user === state.auth.user.userId)).sort((a, b) => a.date_from < b.date_from).sort((a, b) => a.likes.find((user) => user === state.auth.user.userId) === b.likes.find((user) => user === state.auth.user.userId) ? 0 : a.likes.find((user) => user === state.auth.user.userId) ? -1 : 1) : [],
    user: state.auth.user,
    roles: state.info.data.roles
  }),
  {
    add, edit, remove, like, unlike, loadnext, hide, pushState: push
  }
)
export default class Messages extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    loaded: PropTypes.bool,
    moreEnabled: PropTypes.bool,
    error: PropTypes.string,
    user: PropTypes.object
  }

  state = {
    active: false,
    message: this.defaultMessage()
  }

  handleChange = (item, value) => {
    this.setState({
      message: {...this.state.message, [item]: value}
    })
  }

  handleSave = () => {
    const message = {...this.state.message, text: this.state.message.text.toString ? this.state.message.text.toString('markdown') : ''}
    let errors = []
    const keys = Object.keys(this.state.message)
    keys.forEach((key) => {
      let value = (message[key] + '').trim()
      if (value.length < 2) {
        errors.push(key)
      }
    })
    if (errors.length > 0) {
      return this.setState({messageWarning: true})
    }
    if (this.state.message._id) {
      this.props.edit(this.state.message._id, {
        ...this.state.message,
        date_from: this.state.message.date_from.getTime(),
        date_to: this.state.message.date_to.getTime(),
        text: message.text
      })
    } else {
      this.props.add({
        ...this.state.message,
        date_from: this.state.message.date_from.getTime(),
        date_to: this.state.message.date_to.getTime(),
        text: message.text
      })
    }
    this.handleToggle()
  }

  defaultMessage () {
    return {...defaultMessage(),
      text: RichTextEditor ? RichTextEditor.createEmptyValue() : '',
      role: this.props.user.roles
    }
  }

  handleToggle = () => {
    this.setState({
      message: this.defaultMessage(),
      messageWarning: null,
      active: !this.state.active
    })
  }

  handleEdit (item) {
    const message = Object.assign({}, pick(item, ['_id', 'title', 'text', 'date_from', 'date_to', 'role']), {
      date_from: moment(item.date_from).toDate(),
      date_to: moment(item.date_to).toDate(),
      text: RichTextEditor.createValueFromString(item.text, 'markdown')
    })
    this.setState({
      message: message,
      active: true
    })
  }

  handleLoadMore () {
    this.props.loadnext()
  }

  handleRemove (id) {
    this.props.remove(id)
  }

  handleHide (id) {
    this.props.hide(id)
  }
  handleShow (id) {
    this.props.pushState(`/meldinger/${id}`)
  }
  handleLike (id) {
    this.props.like(id)
  }

  handleUnlike (id) {
    this.props.unlike(id)
  }

  renderLightbox () {
    const actions = [
      {
        label: 'Avbryt',
        onClick: this.handleToggle
      },
      {
        label: 'Lagre',
        onClick: this.handleSave
      }
    ]
    const groups = {}
    this.props.roles.forEach((role) => {
      groups[role.id] = role.name
    })
    const toolbarConfig = {
      display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS'],
      INLINE_STYLE_BUTTONS: [
        {label: 'Bold', style: 'BOLD', className: 'custom-css-class'}
      ],
      BLOCK_TYPE_DROPDOWN: [
        {label: 'Normal', style: 'unstyled'}
      ],
      BLOCK_TYPE_BUTTONS: [
        {label: 'UL', style: 'unordered-list-item'},
        {label: 'OL', style: 'ordered-list-item'}
      ]
    }
    return (
      <Dialog
        actions={actions}
        active={this.state.active}
        onEscKeyDown={this.handleToggle}
        onOverlayClick={this.handleToggle}
        title={this.state.message._id ? 'Endre melding' : 'Ny melding'}
      >
        {this.state.messageWarning && (
          <Warning title='Ikke alle feltene er gyldig fylt ut' />
        )}
        <Input type='text' label='Tittel' value={this.state.message.title} onChange={this.handleChange.bind(this, 'title')} required />
        <Autocomplete
          direction='down'
          onChange={this.handleChange.bind(this, 'role')}
          label='Gruppe(r)'
          source={groups}
          value={this.state.message.role}
          required
        />
        <Row>
          <Col sm={6}>
            <DatePicker label='Vises fra' onChange={this.handleChange.bind(this, 'date_from')} value={this.state.message.date_from} required />
          </Col>
          <Col sm={6}>
            <DatePicker label='Vises til' onChange={this.handleChange.bind(this, 'date_to')} value={this.state.message.date_to} required />
          </Col>
        </Row>
        {__CLIENT__ && <RichTextEditor value={this.state.message.text} onChange={this.handleChange.bind(this, 'text')} toolbarConfig={toolbarConfig} />}
      </Dialog>
    )
  }

  renderItemContent (item) {
    return (
      <div className={style.listContainer}>
        <div className={style.content}>
          <h4 className={style.itemTitle}>{item.title}</h4>
          <span className={style.meta}>{moment(item.date_from).fromNow()} av {item.user.cn}</span>
          <div className={style.htmlWrapper}>
            <ReactMarkdown source={item.text} />
          </div>
        </div>
      </div>
    )
  }

  itemMenuItem (item) {
    return (
      <IconMenu key='dropdown' icon='more_vert' position='auto' menuRipple>
        <MenuItem key='edit' icon='edit' caption='Endre' onClick={this.handleEdit.bind(this, item)} />
        <MenuItem key='view' icon='link' caption='Permalenke' onClick={this.handleShow.bind(this, item._id)} />
        <MenuItem key='delete' icon='delete' caption='Slett' onClick={this.handleRemove.bind(this, item._id)} />
      </IconMenu>
    )
  }

  renderLikeButton (item) {
    const {user} = this.props
    const like = item.likes.find((item) => item === user.userId)
    if (like) {
      return <IconButton key='1' icon='favorite' onClick={this.handleUnlike.bind(this, item._id)} accent />
    } else {
      return <IconButton key='1' icon='favorite_border' onClick={this.handleLike.bind(this, item._id)} accent />
    }
  }

  renderHideButton (item) {
    return (
      <IconButton key='hide' icon='visibility_off' accent onClick={this.handleHide.bind(this, item._id)} />
    )
  }

  renderItems (items, moreEnabled) {
    return (
      <div>
        <List className={style.cardList}>
          {items.map((item, i) => {
            return (
              <div key={i}>
                <ListDivider key='div' />
                <ListItem
                  key={i}
                  itemContent={this.renderItemContent(item)}
                  rightActions={[this.renderLikeButton(item), this.renderHideButton(item), this.itemMenuItem(item)]}
                />
              </div>
            )
          })}
        </List>
        {moreEnabled && (
          <List className={style.cardList}>
            <ListDivider />
            <ListItem key='more' itemContent={(
              <div className={style.listContainerTight}>
                <Button label='Last inn flere' onClick={this.handleLoadMore.bind(this)} />
              </div>
            )} />
          </List>
        )}
      </div>
    )
  }

  render () {
    const {user, items, moreEnabled} = this.props
    return (
      <div>
        {user && (
          <div>
            <CardTitle title='Meldinger' className={style.cardTitle}>
              <div className={style.cardButton}>
                <Button label='Ny melding' onClick={this.handleToggle} />
              </div>
            </CardTitle>
            {this.props.loaded && this.renderItems(items, moreEnabled)}
            {this.renderLightbox()}
          </div>
        )}
      </div>
    )
  }
}
