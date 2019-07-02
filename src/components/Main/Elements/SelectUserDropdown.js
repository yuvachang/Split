import React, { Component } from 'react'

class SelectUserDropdown extends Component {
  state = {
    selected: {},
    open: false,
    filteredUsers: [],
    inputClearable: false,
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

  clearInput = async () => {
    this.searchInput.value = ''

    await this.setState({
      open: false,
      filteredUsers: [],
      inputClearable: false,
    })
  }

  filterUsers = async e => {
    if (e.target.value.length > 0) {
      const filtered = this.props.users.filter(user =>
        user.displayName.toLowerCase().includes(e.target.value.toLowerCase())
      )
      if (!filtered[0]) {
        filtered.push({ id: '1', displayName: 'Not found...' })
      }
      await this.setState({
        open: true,
        filteredUsers: filtered,
        inputClearable: true,
      })
    } else {
      await this.setState({
        open: false,
        filteredUsers: [],
        inputClearable: false,
      })
    }
  }

  selectUser = user => {
    this.props.clickAction(user)
    this.setState({
      selected: user,
      open: false,
    })
  }

  removeSelected = () => {
    this.props.clearAction()
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
    const { placeholder, users } = this.props
    const { open, selected, filteredUsers, inputClearable } = this.state

    return (
      <div style={{ minWidth: '75%', maxWidth: '75%' }}>
        <div className='select-user container' ref={node => (this.menu = node)}>
          <div className='select-user message'>
            {selected.id ? (
              <div>
                {selected.displayName}
                <img
                  alt='icon'
                  src='/images/remove.svg'
                  className='icon grey left'
                  onClick={this.removeSelected}
                />
              </div>
            ) : (
              <div className='search-div' style={{ border: 'none' }}>
                <img
                  alt='icon'
                  src='/images/search.svg'
                  className='icon grey'
                />
                <input
                  ref={node => (this.searchInput = node)}
                  className='textarea-only'
                  placeholder={placeholder}
                  type='text'
                  onChange={this.filterUsers}
                  autoCapitalize='off'
                  autoComplete='off'
                />
                {inputClearable && (
                  <img
                    alt='icon'
                    src='/images/remove.svg'
                    className='icon grey left'
                    style={{ transform: 'translateX(-8px)' }}
                    onClick={this.clearInput}
                  />
                )}
              </div>
            )}
            <img
              alt='icon'
              onClick={this.toggleDropdown}
              src='/images/down-arrow.svg'
              className={
                open ? 'icon right grey upsidedown' : 'icon right grey'
              }
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
                      {user.displayName}
                    </div>
                  )
                })
              : 'No one here...'}
          </div>
        </div>
      </div>
    )
  }
}

export default SelectUserDropdown
