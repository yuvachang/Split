import React, { Component } from 'react'
import ListItem from '../Elements/ListItem'

class SelectUser extends Component {
  state = {
    userAmounts: [],
    open: false,
  }

  toggleDropdown = action => {
    if (action === 'close') {
      this.setState({
        open: false,
      })
      this.props.updateUserAmounts()
    } else if (action === 'open') {
      this.setState({ open: true })
    } else {
      const toggle = !this.state.open
      this.setState({ open: toggle })
      if (!toggle) {
        this.props.updateUserAmounts()
      }
    }
  }

  clickListener = e => {
    if (this.state.open && !this.menu.contains(e.target)) {
      this.toggleDropdown('close')
    }
  }

  componentDidUpdate = prevProps => {
    if (prevProps.userAmounts !== this.props.userAmounts) {
      this.setState({
        userAmounts: this.props.userAmounts,
      })
    }
  }

  componentDidMount = async () => {
    document.addEventListener('mousedown', this.clickListener)

    this.setState({
      userAmounts: this.props.userAmounts,
    })
  }

  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.clickListener)
  }

  render() {
    const { addUser, removeUser, users, userAmounts } = this.props
    const { open } = this.state

    const selected = users.map(user => user.id)
    const options = Object.keys(userAmounts).filter(
      userId => !selected.includes(userId)
    )

    return (
      <div className='select-user container' ref={node => (this.menu = node)}>
        <div className='select-user message'>
          <ul className='comma-list'>
            {users[0]
              ? users.map(user => (
                  <li
                    className={open ? 'click-to-delete' : ''}
                    onClick={open ? () => removeUser(user.id) : null}
                    key={user.id}>
                    {user.name}
                  </li>
                ))
              : 'Add a person.'}
          </ul>
          <img
            onClick={this.toggleDropdown}
            src='/images/down-arrow.svg'
            className={open ? 'icon right upsidedown' : 'icon right'}
          />
        </div>
        <div className={open ? 'select-user open' : 'select-user closed'}>
          {options[0] ? options.map(userId => {
            return (
              <div className='select-user menu' key={userId}>
                {userAmounts[userId].name}
                <img
                  src='/images/add.svg'
                  className='icon right'
                  onClick={() => addUser(userAmounts[userId])}
                />
              </div>
            )
          }) : <div>{'('}Everyone added already.{')'}</div>}
        </div>
      </div>
    )
  }
}

export default SelectUser
