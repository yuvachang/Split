import React, { Component } from 'react'
import ListItem from '../Elements/ListItem'
import FadingScroll from './FadingScroll'

class DropDownList extends Component {
  state = {
    list: [],
    open: false,
  }

  toggleDropdown = action => {
    if (action === 'close') {
      this.setState({
        open: false,
      })
    } else if (action === 'open') {
      this.setState({ open: true })
    } else {
      this.setState({ open: !this.state.open })
    }
  }

  clickListener = e => {
    if (this.state.open && !this.menu.contains(e.target)) {
      this.toggleDropdown('close')
    }
  }

  componentDidUpdate = prevProps => {
    if (prevProps.listContent !== this.props.listContent) {
      this.setState({
        list: this.props.listContent,
      })
    }
  }

  componentDidMount = async () => {
    document.addEventListener('mousedown', this.clickListener)

    this.setState({
      list: this.props.listContent,
    })
  }

  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.clickListener)
  }

  render() {
    const { clickAction, message, selected } = this.props
    const { list, open } = this.state

    return (
      <div className='drop-down container' ref={node => (this.menu = node)}>
        <div className='drop-down message'>
          {selected ? selected : message}
          <img
            onClick={this.toggleDropdown}
            src='./images/down-arrow.svg'
            className={open ? 'icon right upsidedown' : 'icon right'}
            style={{ marginRight: '12px' }}
          />
        </div>
        <div className={open ? 'drop-down open' : 'drop-down closed'}>
          {list[0]
            ? list.map(item => {
                return (
                  <ListItem
                    key={item.id}
                    content={item}
                    clickAction={e => {
                      clickAction(e)
                      this.toggleDropdown('close')
                    }}
                    rightIcon={
                      item.avatarUrl ? item.avatarUrl : './images/person.svg'
                    }
                  />
                )
              })
            : null}
        </div>
      </div>
    )
  }
}

export default DropDownList
