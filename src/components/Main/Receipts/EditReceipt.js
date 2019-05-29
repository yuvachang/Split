import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  listenReceipt,
  unlistenReceipt,
  selectReceipt,
  updateRow
} from '../../../store/actions/receiptsActions'
import FadingScroll from '../Elements/FadingScroll'
import Rows from './Rows'

class SingleReceipt extends Component {
  componentDidMount = async () => {
    const receiptId = this.props.location.pathname.slice(10)
    if (!this.props.receipt.id) {
      await this.props.selectReceipt(receiptId)
    }
    //set listener on receipt
    this.props.listenReceipt(receiptId)
  }

  componentWillUnmount = async () => {
    //unset listener for receipt
    this.props.unlistenReceipt(this.props.receipt.id)
  }

  render() {
    const { receipt, updateRow } = this.props
    if (!receipt.id) {
      return null
    } else if (receipt.id === 'DNE') {
      return 'Receipt does not exist or has been deleted.'
    } else
      return (
        <div className='receipt-edit'>
          Receipt:
          <br />
          {receipt.receiptName}
          <br /> Members:
          <ul>
            {Object.keys(receipt.userAmounts).map(user => (
              <li key={user}>
                {receipt.userAmounts[user].name} : $
                {receipt.userAmounts[user].amount}
              </li>
            ))}
          </ul>
          <br />
          <FadingScroll>
            <div>//editable rows here//</div>
            <Rows rows={receipt.rows} updateRow={(idx, row) => updateRow(idx, row, receipt.id)}/>
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
  selectReceipt: RID => dispatch(selectReceipt(RID)),
  updateRow: (rowIdx, row, RID) => dispatch(updateRow(rowIdx, row, RID))
})

export default connect(
  mapState,
  mapDispatch
)(SingleReceipt)
