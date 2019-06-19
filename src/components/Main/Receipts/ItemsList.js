import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  toggleDeleteRow,
  updateRow,
  deleteRow,
  addRow,
} from '../../../store/actions/receiptsActions'
import ItemsRow from './ItemsRow'
import ScrollContainer from '../Elements/ScrollContainer'

class ItemsList extends Component {
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
    const {
      rows,
      updateRow,
      receipt,
      deleteRow,
      addRow,
      toggleDeleteRow,
    } = this.props
    const { editing } = this.state
    return (
      <ScrollContainer showButtons={true}>
        {Object.keys(rows).map(rowIdx => {
          // if row deleted, render RowDeleted
          if (rows[rowIdx].deletePending)
            return (
              <ItemsRow
                key={rowIdx}
                startEdit={this.startEdit}
                row={rows[rowIdx]}
                rowIdx={rowIdx}
                deleted={true}
                deleteRow={deleteRow}
                undelete={() => this.undeleteRow(rowIdx)}
              />
            )
          // else show normal row
          else
            return (
              <ItemsRow
                key={rowIdx}
                stopEdit={this.stopEdit}
                row={rows[rowIdx]}
                rowIdx={rowIdx}
                updateRow={updateRow}
                userAmounts={receipt.userAmounts}
                deleteRow={this.props.toggleDeleteRow}
              />
            )
        })}
      </ScrollContainer>
    )
  }
}

const mapState = state => ({
  receipt: state.receipts.selected,
  rows: state.receipts.selected.rows,
})

const mapDispatch = dispatch => ({
  toggleDeleteRow: (rowIdx, ua, RID) =>
    dispatch(toggleDeleteRow(rowIdx, ua, RID)),
  updateRow: (rowIdx, row, ua, RID) =>
    dispatch(updateRow(rowIdx, row, ua, RID)),
  deleteRow: (rowIdx, RID) => dispatch(deleteRow(rowIdx, RID)),
  addRow: (idx, RID) => dispatch(addRow(idx, RID)),
})

export default connect(
  mapState,
  mapDispatch
)(ItemsList)

// export default ItemsList

// <table>
// <tbody id='receipt-table'>
//   {Object.keys(rows).map(rowIdx => {
//     // if row deleted, render RowDeleted
//     if (rows[rowIdx].deletePending)
//       return (
//         <ItemsRow
//           key={rowIdx}
//           startEdit={this.startEdit}
//           row={rows[rowIdx]}
//           rowIdx={rowIdx}
//           deleted={true}
//           deleteRow={deleteRow}
//           undelete={() => this.undeleteRow(rowIdx)}
//         />
//       )
//     else if (rowIdx === editing)
//       // if editing row, render RowEdit
//       return (
//         <RowEdit
//           key={rowIdx}
//           stopEdit={this.stopEdit}
//           row={rows[rowIdx]}
//           rowIdx={rowIdx}
//           updateRow={updateRow}
//           userAmounts={receipt.userAmounts}
//           deleteRow={this.props.toggleDeleteRow}
//         />
//       )
//     // else show normal row
//     else
//       return (
//         <ItemsRow
//           key={rowIdx}
//           startEdit={this.startEdit}
//           row={rows[rowIdx]}
//           rowIdx={rowIdx}
//         />
//       )
//   })}
//   <tr>
//     <td>
//       <img
//         src='/images/add.svg'
//         className='icon'
//         onClick={this.addRow}
//       />
//     </td>
//   </tr>
// </tbody>
// </table>
