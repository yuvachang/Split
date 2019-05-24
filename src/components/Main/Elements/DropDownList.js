import React, { Component } from 'react'
import ListItem from '../Elements/ListItem'

class DropDownList extends Component {
  state = {
    list: [],
    open: false,
  }

  openMenu = () => {
    this.setState({ open: true })
  }

  closeMenu = () => {
    this.setState({ open: false })
  }

  clickListener = e => {
    if (this.state.open && !this.menu.contains(e.target)) {
      this.closeMenu()
    }
    return
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
    const { clickAction } = this.props
    const { list, open } = this.state

    return (
      <div className='drop-down container'>
        <p onClick={this.openMenu}>Select a group.</p>
        <div
          className={open ? 'drop-down open' : 'drop-down closed'}
          ref={node => (this.menu = node)}>
          {// open ? (
          list[0] ? (
            <div>
              
              {list.map(item => {
                return (
                  <ListItem
                    key={item.id}
                    success={true}
                    content={item}
                    rightAction={clickAction}
                    rightIcon={
                      item.avatarUrl ? item.avatarUrl : './images/person.svg'
                    }
                  />
                )
              })}
            </div>
          ) : null
          // )
          // : (
          //   <p onClick={this.openMenu}>Select a group.</p>
          // )
          }
        </div>
      </div>
    )
  }
}

export default DropDownList
