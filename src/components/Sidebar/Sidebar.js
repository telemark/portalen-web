import React from 'react'
import {Navigation, Link, IconButton} from 'react-toolbox'
import style from './style'

const Sidebar = (props) => {
  return (
    <Navigation type='vertical' className={style.container}>
      {props.items.map((item, i) => {
        return (
          <div key={i} className={style.linkContainer}>
            <Link href={item.url} className={style.link} label={item.title} icon={item.icon || 'link'} target='_blank' />
            <div className={style.actionContainer}>
              {props.removeAction && (
                <IconButton icon='delete' accent className={style.actions} onClick={props.removeAction.bind(this, item)} />
              )}
              {props.editAction && (
                <IconButton icon='edit' accent className={style.actions} onClick={props.editAction.bind(this, item)} />
              )}
            </div>
          </div>
        )
      })}
    </Navigation>
  )
}

Sidebar.propTypes = {
  items: React.PropTypes.array.isRequired,
  editAction: React.PropTypes.func,
  removeAction: React.PropTypes.func
}

export default Sidebar
