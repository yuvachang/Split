// import React from 'react'

// const ItemsRow = () => (
//   <tr className={deleted ? 'deleted-row' : ''}>
//     <td className='editbutton'>
//       {row.edit ? (
//         row.edit
//       ) : deleted ? (
//         <img
//           src='/images/trash.svg'
//           className='icon'
//           onClick={() => deleteRow(rowIdx)}
//         />
//       ) : (
//         <img
//           src='/images/edit.svg'
//           className='icon'
//           onClick={() => startEdit(rowIdx)}
//         />
//       )}
//     </td>
//     <td className='item'>{row.item}</td>
//     <td className='cost'>{row.cost}</td>
//     <td className='users'>
//       {!Array.isArray(row.users) ? (
//         row.users
//       ) : row.users[0] ? (
//         <ul className='comma-list'>
//           {row.users.map(user => (
//             <li key={user.id}>{user.name}</li>
//           ))}
//         </ul>
//       ) : (
//         'No one yet.'
//       )}
//     </td>
//     <td className='deletebutton'>
//       {deleted ? (
//         <img
//           src='/images/restore.svg'
//           className='icon'
//           onClick={undelete ? undelete : null}
//         />
//       ) : null}
//     </td>
//   </tr>
// )

// export default ItemsRow

import React, { Component } from 'react'
import SelectUser from '../Elements/SelectUser'

class ItemsRow extends Component {
  state = {
    open: false,
    // minHeight: 0,
    isEdit: false,
    inputValue: 0,
    rowData: {},
    unaddedUsers: [],
  }

  // input methods
  toggleEdit = () => {
    this.setState({
      isEdit: !this.state.isEdit,
    })
  }

  handleSave = async () => {
    console.log('save row function')
    // if (this.state.inputValue !== this.props.userAmount.paid) {
    //   const newUsrAmt = this.props.userAmount
    //   newUsrAmt.paid = parseFloat(this.state.inputValue.toFixed(2))
    //   await this.props.updateUserAmt(newUsrAmt)
    // }
  }

  handleChange = async e => {
    await this.setState({
      inputValue: Number(e.target.value),
    })
  }
  // end input methods

  toggleDropdown = action => {
    if (action === 'close') {
      this.setState({
        open: false,
        isEdit: false,
      })
    } else if (action === 'open') {
      this.setState({ open: true })
    } else {
      const toggle = !this.state.open
      let isEdit = this.state.isEdit
      if (!toggle) {
        isEdit = false
      }
      this.setState({ open: toggle, isEdit })
    }
  }

  clickListener = async e => {
    // console.log(
    //   this.menu.clientHeight,
    //   this.menu.scrollHeight,
    //   this.menu.scrollTop
    // )
    if (e.target.className.includes('selectuserdropdownarrow')) {
      console.log('setting minheight from clicklistener', this.state.minHeight)
      // this.setMinHeight()
    }
    // console
    //   .log
    //   // e.target
    //   // this.selectUser.clientHeight,
    //   // this.selectUser.scrollHeight,
    //   // this.selectUser.scrollTop
    //   ()

    // if (
    //   this.state.open &&
    //   !this.menu.contains(e.target) &&
    //   !e.target.className.includes('scrollArrowID')
    // ) {
    //   this.toggleDropdown('close')
    // }
  }

  selectUser = user => {
    this.props.clickAction(user)
    this.setState({
      selected: user,
      open: false,
    })
  }

  // removeSelected = () => {
  //   this.props.clearAction()
  //   this.setState({
  //     selected: {},
  //   })
  // }

  // setMinHeight = async () => {
  //   const users = this.props.row.users.length
  //   let minHeight = 90 + (this.selectUser.scrollHeight - 35)
  //   console.log(minHeight)
  //   if (users) {
  //     minHeight += users * 45 + 10
  //   }
  //   await this.setState({
  //     minHeight,
  //   })
  // }

  // updateInputValue = async () => {
  //   await this.setState({
  //     inputValue: this.props.userAmount.paid,
  //   })
  // }

  usersChanged = () => {
    const state = this.state.users
    const row = this.props.row.users

    if (state.length !== row.length) return true
    const hash = {}
    state.forEach(user => {
      hash[user.id] = 1
    })
    for (let i = 0; i < row.length; i++) {
      if (!hash[row[i].id]) return true
    }

    return false
  }

  updateUserAmountsAndRow = async () => {
    const { userAmounts, rowIdx, row } = this.props
    const { users, cost } = this.state

    // dont update if nothing changed
    if (!this.usersChanged() && row.cost === cost) return

    const usersIds = users.map(user => user.id)
    const amount = Number((cost / users.length).toFixed(2))

    Object.keys(userAmounts).forEach(userId => {
      if (usersIds.includes(userId)) {
        userAmounts[userId].items[rowIdx] = amount
      } else {
        delete userAmounts[userId].items[rowIdx]
      }
      userAmounts[userId].amount = this.sumCosts(userAmounts[userId].items)
    })

    // console.log('usrAmts', userAmounts, 'users', users)

    this.updateRow(userAmounts)
  }

  addUser = async user => {
    // add user to row
    await this.setState({
      users: [...this.state.users, { id: user.id, name: user.name }],
    })
  }

  //vvv DISPATCH METHODS

  updateRow = async userAmounts => {
    const { rowIdx, updateRow } = this.props
    if (userAmounts) {
      await updateRow(rowIdx, this.state, userAmounts)
    } else {
      await updateRow(rowIdx, this.state, null)
    }
  }

  //^^^ DISPATCH METHODS

  mapRowToState = async () => {
    const { row, userAmounts } = this.props

    const unaddedUsers = Object.keys(userAmounts)
      .filter(userId => !row.users.includes(userId))
      .map(id => userAmounts[id])

    await this.setState({
      rowData: this.props.row,
      unaddedUsers,
    })
  }

  componentDidUpdate = async prevProps => {
    if (prevProps !== this.props) {
      console.log('ItemsRow updated')
      // await this.updateInputValue()
      // this.setMinHeight()
    }
  }

  componentDidMount = async () => {
    console.log('ItemsRow mounted', this.selectUser)

    document.addEventListener('mousedown', this.clickListener)
    await this.mapRowToState()
    // this.setMinHeight()
    // await this.updateInputValue()
  }

  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.clickListener)
  }

  render() {
    const {
      row,
      startEdit,
      rowIdx,
      deleted,
      undelete,
      deleteRow,
      userAmounts,
    } = this.props
    const { open, minHeight, rowData, unaddedUsers } = this.state
    return (
      <div
        className={open? 'items-row container open': 'items-row container'}
        ref={node => (this.menu = node)}
        >
        {/* {!!row.users.length &&  */}
        <div className='items-row color-bar' />
        {/* } */}

        <div className='items-row top-row'>
          {/* TOP ROW */}
          <div className='items-row row'>
            {open ? (
              <input
                name='item'
                type='text'
                className='outline-only'
                placeholder='Item name'
                style={{ marginRight: '5px' }}
                value={rowData.item}
                onChange={this.handleChange}
              />
            ) : (
              <div className='items-row name'>{row.item || 'Item name'}</div>
            )}
            {open && '$'}
            {open ? (
              <input
                name='cost'
                type='number'
                className='outline-only'
                style={{ maxWidth: '75px', textAlign: 'right' }}
                value={Number(rowData.cost).toString() || 0}
                onChange={this.handleChange}
              />
            ) : (
              <div className='items-row amount'>${row.cost || '0'}</div>
            )}

            <img
              alt='open/close'
              onClick={
                open
                  ? async () => {
                      this.toggleDropdown('close')
                      await this.handleSave()
                    }
                  : () => {
                      this.toggleDropdown('open')
                    }
              }
              src={open ? '/images/save.svg' : '/images/edit.svg'}
              className='icon right grey'
              style={
                open
                  ? { right: '-25px' }
                  : { right: '-25px', borderRadius: '0', width: '17px' }
              }
            />
          </div>
        </div>

        <div className={`items-row bottom-rows ${open ? '' : 'collapsed'}`}>
          {/* SECOND ROW */}
          <div className='items-row row' style={{ alignItems: 'flex-start' }}>
            <div
              className='items-row add-user'
              ref={node => (this.selectUser = node)}>
              <SelectUser addUser={this.addUser} users={unaddedUsers} />
            </div>
          </div>

          {/* {isEdit ? (
              <input
                className='outline-only'
                style={{ maxWidth: '75px' }}
                value={Number(inputValue).toString()}
                type='number'
                onChange={this.handleChange}
              />
            ) : (
              <div className='items-row amount'>${userAmounts.paid}</div>
            )} */}

          {/* {isEdit ? (
              <img
                src='/images/save.svg'
                alt='save icon'
                className='icon grey right'
                onClick={async () => {
                  await this.handleSave()
                  this.toggleEdit()
                }}
                style={{ right: '-25px' }}
              />
            ) : (
              <img
                src='/images/edit.svg'
                alt='edit icon'
                className='icon grey right'
                onClick={this.toggleEdit}
                style={{ right: '-25px', borderRadius: '0', width: '17px' }}
              />
            )} */}
        </div>
      </div>
    )
  }
}

export default ItemsRow
