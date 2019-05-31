import React, { Component } from 'react'
import RowEdit from './RowEdit'
import Row from './Row'
import RowDeleted from './RowDeleted'

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

  render() {
    const header = {
      edit: 'Edit',
      item: 'Item',
      cost: 'Price',
      users: 'Users',
      delete: '  ',
    }
    const { rows, updateRow, receipt } = this.props
    const { editing } = this.state
    return (
      <table>
        <tbody id='receipt-table'>
          <Row row={header} />

          {Object.keys(rows).map(rowIdx => {
            // if row deleted, render RowDeleted
            if (rowIdx.delete)
              return <RowDeleted key={rowIdx} row={rows[rowIdx]} />
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
        </tbody>
      </table>
    )
  }
}

export default Table
