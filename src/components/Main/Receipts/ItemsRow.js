import React, { Component } from 'react'
import SelectUser from '../Elements/SelectUser'
import AddedUser from '../Elements/AddedUser'
import CardItemInnertext from '../Elements/CardItemInnertext'

class ItemsRow extends Component {
  state = {
    open: false,
    // minHeight: 0,
    maxHeight: 0,
    isEdit: false,
    inputValue: 0,
    rowData: {
      users: [],
    },
    unaddedUsers: [],
    showModal: false,
  }

  toggleEdit = async () => {
    //set maxHeight of bottomRows to ensure smooth&consistent css max-height transition
    await this.setState({
      isEdit: !this.state.isEdit,
      maxHeight: this.bottomRows.scrollHeight,
    })
  }

  handleSave = async () => {
    // adjust maxHeight for number of added users
    await this.setState({
      isEdit: false,
      maxHeight: this.bottomRows.scrollHeight,
    })
  }

  saveOnBlur = async e => {
    if (e.target.name === 'item') {
      this.updateUserAmountsAndRow('item')
    } else {
      // check if all item costs + this item cost < receipt.total
      let targetValue = Number(e.target.value)

      const { rows, total: receiptTotal } = this.props.receipt
      const itemsTotal = Object.keys(rows)
        .map(rowIdx =>
          rowIdx === this.props.rowIdx
            ? 0
            : rows[rowIdx].deletePending
            ? 0
            : Number(rows[rowIdx].cost)
        )
        .reduce((a, b) => a + b)
      const remainderCost = Number(receiptTotal) - itemsTotal

      if (remainderCost < 0) {
        targetValue = 0
      } else {
        if (targetValue > remainderCost) {
          targetValue = remainderCost
        } else if (targetValue < 0) {
          targetValue = Math.abs(targetValue)
        }
      }

      if (targetValue !== e.target.value) {
        await this.setState({
          rowData: {
            ...this.state.rowData,
            cost: targetValue,
          },
        })
      }

      this.updateUserAmountsAndRow()
    }
  }

  handleChange = async e => {
    if (e.target.name === 'cost') {
      e.target.value = Number(Number(e.target.value).toFixed(2))
    }

    await this.setState({
      rowData: {
        ...this.state.rowData,
        [e.target.name]: e.target.value,
      },
    })
  }

  toggleDropdown = action => {
    if (action === 'close') {
      this.setState({
        open: false,
        isEdit: false,
      })
    } else if (action === 'open') {
      this.setState({ open: true, maxHeight: this.bottomRows.scrollHeight })
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
    if (
      !this.item.contains(e.target) &&
      !this.state.isEdit &&
      this.state.open
    ) {
      this.toggleDropdown('close')
    }
  }

  selectUser = user => {
    this.props.clickAction(user)
    this.setState({
      selected: user,
      open: false,
    })
  }

  addUser = async user => {
    // add userId to state.rowData.users
    await this.setState({
      rowData: {
        ...this.state.rowData,
        users: [...this.state.rowData.users, user.id],
      },
      unaddedUsers: this.state.unaddedUsers.filter(
        unaddedUser => unaddedUser.id !== user.id
      ),
    })

    // calculate new userAmounts
    this.updateUserAmountsAndRow('users')
  }

  removeUser = async user => {
    // remove userId from state.rowData.users
    await this.setState({
      rowData: {
        ...this.state.rowData,
        users: this.state.rowData.users.filter(userId => userId !== user.id),
      },
      unaddedUsers: [...this.state.unaddedUsers, user],
    })

    // calculate new userAmounts
    this.updateUserAmountsAndRow('users')
  }

  sumCosts = obj => {
    const vals = Object.values(obj)
    if (vals.length) {
      return Number(vals.reduce((a, b) => a + b).toFixed(2))
    } else return 0
  }

  updateUserAmountsAndRow = async whatChanged => {
    const { userAmounts, rowIdx, row } = this.props
    const { users: usersIds, cost, item } = this.state.rowData

    // return if nothing changed
    if (!whatChanged && row.cost === cost && row.item === item) return
    // no userAmounts update if only name changed
    else if (whatChanged === 'item') {
      this.updateRow()
      return
    } else {
      // else update receipt.userAmounts
      const amount = Number((cost / usersIds.length).toFixed(2))

      Object.keys(userAmounts).forEach(userId => {
        if (usersIds.includes(userId)) {
          userAmounts[userId].items[rowIdx] = amount
        } else {
          delete userAmounts[userId].items[rowIdx]
        }

        userAmounts[userId].amount = this.sumCosts(userAmounts[userId].items)

        // calculate owe against paid
        if (userAmounts[userId].amount > userAmounts[userId].paid) {
          userAmounts[userId].owe =
            userAmounts[userId].amount - userAmounts[userId].paid
        } else {
          userAmounts[userId].owe = 0
        }
      })

      // pass to props backend handler
      this.updateRow(userAmounts)
    }
  }

  //vvv DISPATCH METHODS

  deleteRow = async (e, pendRowDelete) => {
    if (pendRowDelete) {
      // if (pendRowDelete === 'perm-delete') {
      //   this.props.deleteRow(rowIdx, userAmounts)
      // }
      const { userAmounts, rowIdx, row } = this.props

      row.users.forEach(userId => {
        delete userAmounts[userId].items[rowIdx]
        // run sumCosts on all userAmounts to ensure no data falls out of sync
        userAmounts[userId].amount = this.sumCosts(userAmounts[userId].items)
      })

      await this.props.toggleDeleteRow(rowIdx, userAmounts)
    } else {
      const { item, cost } = this.state.rowData
      if (item || cost) {
        // trigger modal/alert
        this.setState({
          open: false,
          showModal: true,
        })
      } else {
        this.props.deleteRow()
      }
    }
  }

  updateRow = async userAmounts => {
    const { rowIdx, updateRow } = this.props
    if (userAmounts) {
      await updateRow(rowIdx, this.state.rowData, userAmounts)
    } else {
      await updateRow(rowIdx, this.state.rowData, null)
    }
  }

  //^^^ DISPATCH METHODS

  mapRowToState = async () => {
    const { row, userAmounts } = this.props
    const unaddedUsers = []

    // state.rowData.users = array of userIds
    // state.unaddedUsers = array of userAmount user objs
    Object.keys(userAmounts).forEach(userId => {
      if (!row.users.includes(userId)) {
        unaddedUsers.push(userAmounts[userId])
      }
    })

    await this.setState({
      rowData: row,
      unaddedUsers,
    })
  }

  componentDidUpdate = async prevProps => {
    if (prevProps !== this.props) {
      console.log('ItemsRow updated')
      await this.mapRowToState()
      // await this.updateInputValue()
      // this.setMinHeight()
    }
  }

  componentDidMount = async () => {
    // console.log('ItemsRow mounted', this.selectUser)

    document.addEventListener('mousedown', this.clickListener)
    await this.mapRowToState()
  }

  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.clickListener)
  }

  render() {
    const { row, userAmounts, deleteRow, toggleDeleteRow } = this.props

    const {
      open,
      isEdit,
      maxHeight,
      rowData,
      unaddedUsers,
      showModal,
    } = this.state
    return (
      <div className='items-row container' ref={node => (this.item = node)}>
        {/* DELETE DIALOGUE */}
        {showModal && (
          <div className='items-row confirm-delete'>
            Delete this item?
            <div className='options'>
              <div
                className='button card short grey-hover'
                onClick={() => {
                  this.setState({
                    showModal: false,
                  })
                }}>
                No
              </div>
              <div
                className='button card short red'
                onClick={e => {
                  this.deleteRow(e, 'pendDelete')
                }}>
                Yes
              </div>
            </div>
          </div>
        )}

        {/* COLOR-BAR-BOTTOM */}
        <div className={`items-row color-bar ${open ? 'collapsed' : ''}`}>
          {!!row.users.length &&
            row.users.map(userId => {
              return (
                <div
                  key={userId}
                  className='color-bar-segment'
                  style={{ backgroundColor: userAmounts[userId].color }}
                />
              )
            })}
        </div>

        <div className='items-row top-row'>
          {/* TOP ROW */}
          <div className='items-row row'>
            {isEdit ? (
              <input
                name='item'
                type='text'
                className='outline-only'
                placeholder='Item name'
                style={{ marginRight: '5px' }}
                value={rowData.item}
                onChange={this.handleChange}
                onBlur={this.saveOnBlur}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    e.target.blur()
                  }
                }}
              />
            ) : (
              <div className='items-row name'>{row.item || 'Item name'}</div>
            )}
            {isEdit && '$'}
            {isEdit ? (
              <input
                name='cost'
                type='number'
                className='outline-only'
                style={{ maxWidth: '65px', textAlign: 'right' }}
                value={Number(rowData.cost).toString() || 0}
                onChange={this.handleChange}
                onBlur={this.saveOnBlur}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    e.target.blur()
                  }
                }}
              />
            ) : (
              <div className='items-row amount'>${row.cost || '0'}</div>
            )}

            <img
              alt='open/close'
              onClick={
                open
                  ? isEdit
                    ? () => {
                        this.handleSave()
                      }
                    : () => {
                        this.toggleDropdown('close')
                      }
                  : () => {
                      this.toggleDropdown('open')
                    }
              }
              src={
                open
                  ? isEdit
                    ? '/images/save.svg'
                    : '/images/down-arrow.png'
                  : '/images/down-arrow.png'
              }
              className={`icon right grey ${
                open && !isEdit ? 'upsidedown' : ''
              }`}
              style={{ right: '-25px', width: '24px', height: '18px' }}
            />
          </div>
        </div>

        {/* BOTTOM-ROWS */}
        <div
          className={`items-row bottom-rows ${open ? '' : 'collapsed'}`}
          style={
            open
              ? isEdit
                ? { maxHeight: 'none' }
                : { maxHeight }
              : { maxHeight: '0' }
          }
          ref={node => (this.bottomRows = node)}>
          {/* EDIT BUTTON OR ADD USER DROPDOWN */}
          <div className='items-row row'>
            {isEdit ? (
              <div>
                <SelectUser addUser={this.addUser} users={unaddedUsers} />
              </div>
            ) : (
              <div>
                <div className='row-button' onClick={this.toggleEdit}>
                  <img
                    src='/images/edit.svg'
                    style={{ width: '17px' }}
                    alt='edit icon'
                    className='icon grey left'
                  />
                  Edit item
                </div>
                <div
                  className='round-icon-button delete-row'
                  onClick={this.deleteRow}>
                  <img src='/images/trash.svg' className='icon' />
                </div>
              </div>
            )}
          </div>

          {/* ADDED USERS LIST */}
          {!!rowData.users.length &&
            rowData.users.map(userId => {
              return (
                <div
                  className='items-row row'
                  key={userId}
                  style={isEdit ? null : { width: '216px' }}>
                  <div
                    className={`user-color-bar ${isEdit ? 'collapsed' : ''}`}
                    style={{ backgroundColor: userAmounts[userId].color }}
                  />

                  {isEdit ? (
                    <AddedUser
                      user={userAmounts[userId]}
                      removeUser={this.removeUser}
                    />
                  ) : (
                    <div className='user-row-container-buttonless'>
                      {userAmounts[userId].name}
                    </div>
                  )}
                </div>
              )
            })}
        </div>
      </div>
    )
  }
}

export default ItemsRow
