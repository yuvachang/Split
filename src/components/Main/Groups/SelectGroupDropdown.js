import React, { Component } from 'react'

class SelectGroupDropdown extends Component {
  state = {
    selected: {},
    open: false,
    filteredGroups: [],
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
      filteredGroups: [],
      inputClearable: false,
    })
  }

  filterGroups = async e => {
    if (e.target.value.length > 0) {
      const filtered = this.props.groups.filter(group =>
        group.groupName.toLowerCase().includes(e.target.value.toLowerCase())
      )
      if (!filtered[0]) {
        filtered.push({ id: '1', groupName: 'Not found...' })
      }
      await this.setState({
        open: true,
        filteredGroups: filtered,
        inputClearable: true,
      })
    } else {
      await this.setState({
        open: false,
        filteredGroups: [],
        inputClearable: false,
      })
    }
  }

  selectGroup = group => {
    this.props.clickAction(group)

    this.setState({
      selected: group,
      open: false,
    })
  }

  removeSelected = () => {
    this.props.clearAction()
    this.setState({
      selected: {},
      filteredGroups: [],
    })
  }

  componentDidMount = async () => {
    document.addEventListener('mousedown', this.clickListener)
  }

  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.clickListener)
  }

  render() {
    const { placeholder, groups } = this.props
    const { open, selected, filteredGroups, inputClearable } = this.state
    return (
      <div className='user-row-container dropdown-only'>
        <div className='select-user container' ref={node => (this.menu = node)}>
          <div className='select-user message'>
            {selected.id ? (
              <div className='innertext'>
                {selected.groupName}
                <img
                  src='/images/remove.svg'
                  className='icon grey left'
                  onClick={this.removeSelected}
                />
              </div>
            ) : (
              <div className='search-div' style={{ border: 'none' }}>
                <img src='./images/search.svg' className='icon grey' />
                <input
                  ref={node => (this.searchInput = node)}
                  className='textarea-only'
                  placeholder={placeholder}
                  type='text'
                  onChange={this.filterGroups}
                  autoCapitalize='off'
                  autoComplete='off'
                />
                {inputClearable && (
                  <img
                    src='/images/remove.svg'
                    className='icon grey left'
                    style={{ transform: 'translateX(-8px)' }}
                    onClick={this.clearInput}
                  />
                )}
              </div>
            )}
            <img
              onClick={this.toggleDropdown}
              src='/images/down-arrow.svg'
              className={
                open ? 'icon right grey upsidedown' : 'icon right grey'
              }
            />
          </div>

          <div className={open ? 'select-user open' : 'select-user closed'}>
            {filteredGroups[0]
              ? filteredGroups.map(group => {
                  return (
                    <div
                      className='select-user user-item'
                      key={group.id}
                      onClick={() => this.selectGroup(group)}>
                      <div className='innertext'>{group.groupName}</div>
                    </div>
                  )
                })
              : groups[0]
              ? groups.map(group => {
                  return (
                    <div
                      className='select-user user-item'
                      key={group.id}
                      onClick={() => this.selectGroup(group)}>
                      <div className='innertext'>{group.groupName}</div>
                    </div>
                  )
                })
              : 'No groups...'}
          </div>
        </div>
      </div>
    )
  }
}

export default SelectGroupDropdown
