import React, { Component } from 'react'
import RowEdit from './RowEdit'
import Row from './Row'

class Table extends Component {
  state = {
    editing: null,
  }

  startEdit = async rowIdx => {
    this.setState({
      editing: rowIdx,
    })
  }

  stopEdit = () => {
    this.setState({
      editing: null,
    })
  }

  undeleteRow = async rowIdx => {
    const sumCosts = obj => {
      const vals = Object.values(obj)
      if (vals.length) {
        return Number(vals.reduce((a, b) => a + b).toFixed(2))
      } else return 0
    }

    const { users, cost, deletePending } = this.props.receipt.rows[rowIdx]
    if (deletePending) {
      const { userAmounts } = this.props.receipt
      const usersIds = users.map(user => user.id)
      const amount = Number((cost / users.length).toFixed(2))

      Object.keys(userAmounts).forEach(userId => {
        if (usersIds.includes(userId)) {
          userAmounts[userId].items[rowIdx] = amount
          // userAmounts[userId].amount += amount
          // run sumCosts to ensure data in sync
          userAmounts[userId].amount = sumCosts(userAmounts[userId].items)
        }
      })

      await this.props.toggleDeleteRow(rowIdx, userAmounts)
    }
  }

  addRow = async () => {
    const keys = Object.keys(this.props.rows)
    const newIdx = Number(keys[keys.length - 1]) + 1
    await this.props.addRow(newIdx)
  }

  render() {
    const header = {
      edit: 'Edit',
      item: 'Item',
      cost: 'Price',
      users: 'Users',
      delete: '  ',
    }
    const { rows, updateRow, receipt, deleteRow, addRow } = this.props
    const { editing } = this.state
    return (
      <table>
        <tbody id='receipt-table'>
          <Row row={header} />

          {Object.keys(rows).map(rowIdx => {
            // if row deleted, render RowDeleted
            if (rows[rowIdx].deletePending)
              return (
                <Row
                  key={rowIdx}
                  startEdit={this.startEdit}
                  row={rows[rowIdx]}
                  rowIdx={rowIdx}
                  deleted={true}
                  deleteRow={deleteRow}
                  undelete={() => this.undeleteRow(rowIdx)}
                />
              )
            else if (rowIdx === editing)
              // if editing row, render RowEdit
              return (
                <RowEdit
                  key={rowIdx}
                  stopEdit={this.stopEdit}
                  row={rows[rowIdx]}
                  rowIdx={rowIdx}
                  updateRow={updateRow}
                  userAmounts={receipt.userAmounts}
                  deleteRow={this.props.toggleDeleteRow}
                />
              )
            // else show normal row
            else
              return (
                <Row
                  key={rowIdx}
                  startEdit={this.startEdit}
                  row={rows[rowIdx]}
                  rowIdx={rowIdx}
                />
              )
          })}
          <tr>
            <td>
              <img
                src='/images/add.svg'
                className='icon'
                onClick={this.addRow}
              />
            </td>
          </tr>
        </tbody>
      </table>
    )
  }
}

export default Table
