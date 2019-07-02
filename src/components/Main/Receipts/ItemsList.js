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
import CardItemInnertext from '../Elements/CardItemInnertext'

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
    const { users, cost: itemCost } = this.props.receipt.rows[rowIdx]

    const { userAmounts } = this.props.receipt
    const itemAmountPerUser = Number((itemCost / users.length).toFixed(2))

    Object.keys(userAmounts).forEach(userId => {
      if (users.includes(userId)) {
        userAmounts[userId].items[rowIdx] = itemAmountPerUser
        // run sumCosts to ensure data in sync
        userAmounts[userId].amount = sumCosts(userAmounts[userId].items)
      }
    })

    await this.props.toggleDeleteRow(rowIdx, userAmounts, this.props.receipt.id)
  }

  addRow = async () => {
    const existingRowIdxs = Object.keys(this.props.receipt.rows)
    let newIdx = existingRowIdxs.length

    while (existingRowIdxs.includes(newIdx.toString())) {
      newIdx++
    }

    await this.props.addRow(newIdx, this.props.receipt.id)
  }

  render() {
    const { rows, updateRow, receipt, deleteRow, toggleDeleteRow } = this.props

    return (
      <ScrollContainer showButtons={false}>
        {!!Object.keys(rows).length &&
          Object.keys(rows).map(rowIdx => {
            // if row deleted, render RowDeleted
            if (rows[rowIdx].deletePending)
              return (
                <div className='deleted-item-row' key={rowIdx}>
                  <CardItemInnertext
                    message1={`${rows[rowIdx].item || 'Unnamed item'}, $${rows[
                      rowIdx
                    ].cost || '0'}:`}
                    message2={
                      !!rows[rowIdx].users.length
                        ? rows[rowIdx].users.length === 1
                          ? `${receipt.userAmounts[rows[rowIdx].users[0]].name}`
                          : `${rows[rowIdx].users.length} people sharing.`
                        : null
                    }
                    leftIcon='/images/restore.svg'
                    leftTitle='Undo delete'
                    leftAction={() => this.undeleteRow(rowIdx)}
                    rightIcon='/images/trash.svg'
                    rightTitle='Delete permanently'
                    rightAction={() => deleteRow(rowIdx, receipt.id)}
                  />
                </div>
              )
            // else show normal row
            else
              return (
                <ItemsRow
                  key={rowIdx}
                  stopEdit={this.stopEdit}
                  row={rows[rowIdx]}
                  rowIdx={rowIdx}
                  userAmounts={receipt.userAmounts}
                  receipt={receipt}
                  updateRow={(rowIdx, row, usrAmts) =>
                    updateRow(rowIdx, row, usrAmts, receipt.id)
                  }
                  toggleDeleteRow={(rowIdx, ua) =>
                    toggleDeleteRow(rowIdx, ua, receipt.id)
                  }
                  deleteRow={() => deleteRow(rowIdx, receipt.id)}
                  // undelete={() => this.undeleteRow(rowIdx)}
                />
              )
          })}
        <div
          className='button card gray'
          style={{ width: '95%', maxHeight: '35px', minHeight: '35px' }}
          onClick={this.addRow}>
          Add a row
        </div>
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
