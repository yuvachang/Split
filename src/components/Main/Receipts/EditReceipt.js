import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  listenReceipt,
  unlistenReceipt,
  toggleDeleteRow,
  updateRow,
  deleteRow,
  addRow,
} from '../../../store/actions/receiptsActions'
import Table from './Table'
import ScrollContainer from '../Elements/ScrollContainer'
import ReceiptHeader from './ReceiptHeader'
import ReceiptAmountsPanel from './ReceiptAmountsPanel'

class EditReceipt extends Component {
  state = {
    payer: {},
    showPanel: false,
  }

  componentDidUpdate = async prevProps => {
    if (!prevProps.receipt.id && this.props.receipt.id) {
      console.log('componentdidupdate editreceipt')
    }
  }

  componentDidMount = async () => {
    // set listener on receipt, will fetch receipt to store
    // no need to use 'selectReceipt'
    const receiptId = this.props.location.pathname.slice(10)
    await this.props.listenReceipt(receiptId)
  }

  componentWillUnmount = async () => {
    //unset listener for receipt
    this.props.unlistenReceipt(this.props.receipt.id)
  }

  render() {
    const {
      receipt,
      updateRow,
      toggleDeleteRow,
      deleteRow,
      addRow,
    } = this.props
    const { showPanel } = this.state
    if (!receipt.id) {
      return null
    } else if (receipt.id === 'DNE') {
      return 'Receipt does not exist or has been deleted.'
    } else
      return (
        <div id='receipt-edit'>
          <ReceiptHeader
            showLeft={showPanel}
            // searchPlaceholder='Find existing friend...'
            // search={this.search}
            b1Src='/images/list.svg'
            b1Click={() => this.switchView('list')}
            b2Src='/images/add.svg'
            b2Click={() => this.switchView('add')}
          />

          <div id='receipt-body'>
            <div id='receipt-left'>
              <ReceiptAmountsPanel receipt={receipt} />
            </div>

            <div id='receipt-right'>
              <ScrollContainer>
                <Table
                  rows={receipt.rows}
                  updateRow={(rowIdx, row, userAmounts) =>
                    updateRow(rowIdx, row, userAmounts, receipt.id)
                  }
                  deleteRow={rowIdx => deleteRow(rowIdx, receipt.id)}
                  addRow={idx => addRow(idx, receipt.id)}
                  toggleDeleteRow={(rowIdx, ua) =>
                    toggleDeleteRow(rowIdx, ua, receipt.id)
                  }
                  receipt={receipt}
                />
              </ScrollContainer>
            </div>
          </div>
        </div>
      )
  }
}

const mapState = state => ({
  receipt: state.receipts.selected,
})

const mapDispatch = dispatch => ({
  listenReceipt: RID => dispatch(listenReceipt(RID)),
  unlistenReceipt: RID => dispatch(unlistenReceipt(RID)),
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
)(EditReceipt)
