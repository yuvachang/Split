import React, { Component } from 'react'
import RowEdit from './RowEdit'
import RowItem from './RowItem'
import RowDeleted from './RowDeleted'

class Rows extends Component {
  state = {
    editing: null,
  }

  startEdit = async rowIdx => {
    this.setState({
      editing: rowIdx
    })
    const newRow = this.props.rows[rowIdx]
    console.log(newRow, rowIdx)
    newRow.isEdit = true
    await this.props.updateRow(rowIdx, newRow)

  }

  componentDidMount = async () => {}

  componentWillUnmount = async () => {}

  render() {
    const header = {
      edit: 'Edit',
      item: 'Item',
      cost: 'Price',
      users: 'Users',
      delete: 'Remove',
    }
    const { rows, updateRows } = this.props
    const { editing } = this.state
    return (
      <div className='receipt-rows'>
        <RowItem row={header} />
        {Object.keys(rows).map(rowIdx => {
          if (rowIdx.delete)
            return (
              <RowDeleted key={rowIdx} row={rows[rowIdx]} updateRows={updateRows} />
            )
          // else if (rowIdx === editing)
          //   return (
          //     <RowEdit key={rowIdx} row={rows[rowIdx]} updateRows={updateRows} />
          //   )
          else
            return (
              <RowItem key={rowIdx} startEdit={this.startEdit} row={rows[rowIdx]} updateRows={updateRows} rowIdx={rowIdx} />
            )
        })}

        {/* {rows.map(row => {
          if (row.delete)
            return (
              <RowDeleted key={row.rowIdx} row={row} updateRows={updateRows} />
            )
          else if (row.rowIdx === editing)
            return (
              <RowEdit key={row.rowIdx} row={row} updateRows={updateRows} />
            )
          else
            return (
              <RowItem key={row.rowIdx} row={row} updateRows={updateRows} />
            )
        })} */}
      </div>
    )
  }
}

export default Rows
