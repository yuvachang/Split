import React, { Component } from 'react'

class SelectUser extends Component {
  state = {
    selected: {},
    open: false,
    filteredUsers: [],
  }

  toggleDropdown = action => {
    if (action === 'close') {
      this.setState({
        open: false,
      })
    } else if (action === 'open') {
      this.setState({ open: true })
    } else {
      const toggle = !this.state.open
      this.setState({ open: toggle })
    }
  }

  clickListener = e => {
    if (this.state.open && !this.menu.contains(e.target)) {
      this.toggleDropdown('close')
    }
  }

  filterUsers = async e => {
    if (e.target.value.length > 0) {
      const filtered = this.props.users.filter(user =>
        user.displayName.toLowerCase().includes(e.target.value.toLowerCase())
      )
      if (!filtered[0]) {
        filtered.push({ id: '1', displayName: 'Not found...' })
      }
      await this.setState({ open: true, filteredUsers: filtered })
    } else {
      await this.setState({ open: false, filteredUsers: [] })
    }
  }

  addUser = () => {
    if (this.state.selected.id) {
      this.props.addUser(this.state.selected)
      this.removeSelected()
    }
  }

  selectUser = user => {
    this.setState({
      selected: user,
      open: false,
    })
  }

  removeSelected = () => {
    this.setState({
      selected: {},
    })
  }

  componentDidMount = async () => {
    document.addEventListener('mousedown', this.clickListener)
  }

  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.clickListener)
  }

  render() {
    const { users } = this.props
    const { open, selected, filteredUsers } = this.state

    return (
      <div className='user-row-container'>
        <div className='select-user container' ref={node => (this.menu = node)}>
          <div
            className='select-user message'
            style={selected.id ? { marginTop: '1px' } : null}>
            {selected.id ? (
              <div>
                <img
                  src='/images/remove.svg'
                  className='icon grey left'
                  onClick={this.removeSelected}
                />
                {selected.displayName || selected.name}
              </div>
            ) : (
              <div className='search-div' style={{ border: 'none' }}>
                <img src='/images/search.svg' className='icon grey' />
                <input
                  className='textarea-only'
                  placeholder='Add a friend...'
                  type='text'
                  onChange={this.filterUsers}
                  autoCapitalize='off'
                  autoComplete='off'
                />
              </div>
            )}
            <img
              onClick={this.toggleDropdown}
              src='/images/down-arrow.svg'
              className={`icon right grey selectuserdropdownarrow ${
                open ? 'upsidedown' : ''
              }`}
            />
          </div>

          <div className={open ? 'select-user open' : 'select-user closed'}>
            {filteredUsers[0]
              ? filteredUsers.map(user => {
                  return (
                    <div
                      className='select-user user-item'
                      key={user.id}
                      onClick={() => this.selectUser(user)}>
                      {user.displayName}
                    </div>
                  )
                })
              : users[0]
              ? users.map(user => {
                  return (
                    <div
                      className='select-user user-item'
                      key={user.id}
                      onClick={() => this.selectUser(user)}>
                      {user.displayName || user.name}
                    </div>
                  )
                })
              : 'No one here...'}
          </div>
        </div>
        <div className='round-icon-button' onClick={this.addUser}>
          <img
            src='/images/add.svg'
            className='icon'
            style={{ filter: 'invert(0.4)' }}
          />
        </div>
      </div>
    )
  }
}

export default SelectUser
