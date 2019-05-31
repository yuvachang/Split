import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  listenReceipt,
  unlistenReceipt,
  // selectReceipt,
  updateRow,
} from '../../../store/actions/receiptsActions'
import FadingScroll from '../Elements/FadingScroll'
import Table from './Table'

const findPayer = usrAmt => {
  const payer = Object.keys(usrAmt).filter(userId => usrAmt[userId].isPayer)
  return usrAmt[payer[0]]
}

class SingleReceipt extends Component {
  componentDidMount = async () => {
    console.log('EDITRECEIPT: mounted')
    const receiptId = this.props.location.pathname.slice(10)

    // if (!this.props.receipt.id) {
    //   // await this.props.selectReceipt(receiptId)
    // }

    // set listener on receipt, will fetch receipt to store
    // no need to use 'selectReceipt'
    this.props.listenReceipt(receiptId)
  }

  componentWillUnmount = async () => {
    //unset listener for receipt
    this.props.unlistenReceipt(this.props.receipt.id)
  }

  render() {
    console.log(
      'EDITRECEIPT: rendered, selected receipt=>',
      this.props.receipt
    )
    const { receipt, updateRow } = this.props
    if (!receipt.id) {
      return null
    } else if (receipt.id === 'DNE') {
      return 'Receipt does not exist or has been deleted.'
    } else
      return (
        <div className='receipt-edit'>
          Receipt: {receipt.receiptName}
          <br /> Members:
          <ul>
            {Object.keys(receipt.userAmounts).map(user => (
              <li key={user}>
                {receipt.userAmounts[user].name} : $
                {receipt.userAmounts[user].amount}
              </li>
            ))}
          </ul>
          Payer: {findPayer(receipt.userAmounts).name}
          <br />
          <FadingScroll>
            <Table
              rows={receipt.rows}
              updateRow={(rowIdx, row, userAmounts) =>
                updateRow(rowIdx, row, userAmounts, receipt.id)
              }
              receipt={receipt}
            />
          </FadingScroll>
        </div>
      )
  }
}

const mapState = state => ({
  receipt: state.receipts.selected,
  // currentUID: state.firebase.auth.uid,
  // loading: state.receipts.loading,
  // groups: state.groups.groups,
  // selectedGroup: state.groups.selected,
})

const mapDispatch = dispatch => ({
  listenReceipt: RID => dispatch(listenReceipt(RID)),
  unlistenReceipt: RID => dispatch(unlistenReceipt(RID)),
  // selectReceipt: RID => dispatch(selectReceipt(RID)),
  updateRow: (rowIdx, row, ua, RID) =>
    dispatch(updateRow(rowIdx, row, ua, RID)),
})

export default connect(
  mapState,
  mapDispatch
)(SingleReceipt)
