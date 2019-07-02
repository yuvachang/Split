import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  deleteReceipt,
  fetchReceipts,
} from '../../../store/actions/receiptsActions'
import Modal from '../Elements/Modal'
import ScrollContainer from '../Elements/ScrollContainer'

class SingleReceipt extends Component {
  state = {
    displayModal: false,
    showDropdown: false,
    rowItems: [],
  }

  openModal = async () => {
    await this.setState({ displayModal: true })
  }

  closeModal = async () => {
    await this.setState({ displayModal: false })
  }

  toggleDropdown = () => {
    this.setState({ showDropdown: !this.state.showDropdown })
  }

  componentDidMount = () => {
    // filter empty items from list
    const { rows } = this.props.receipt
    const rowItems = []
    Object.keys(rows).forEach(rowIdx => {
      if (rows[rowIdx].item || rows[rowIdx].cost || rows[rowIdx].users[0]) {
        rowItems.push(rows[rowIdx])
      }
    })

    if (!!rowItems.length) {
      this.setState({
        rowItems,
      })
    }
  }

  render() {
    if (!this.props.receipt.id) {
      return <h3>Error: No receipt selected.</h3>
    } else if (this.props.receipt.id === 'DNE') {
      return <h3>Receipt doesn't exist.</h3>
    } else {
      const { receipt, deleteReceipt, backToList, fetchReceipts } = this.props
      const { displayModal, showDropdown, rowItems } = this.state
      return (
        <ScrollContainer>
          <Modal
            display={displayModal}
            message={`Delete ${receipt.receiptName} forever?`}
            yesAction={async () => {
              await deleteReceipt(receipt.id)
              await fetchReceipts()
              this.closeModal()
              backToList()
            }}
            noAction={this.closeModal}
          />
          <h3>{receipt.receiptName}</h3>
          <Link
            to={`/receipts/${receipt.id}`}
            style={{ color: '#7f7f7f', margin: '6px 0' }}
            className='small'>
            Edit receipt
          </Link>

          <br />
          <div style={{ textAlign: 'left' }}>
            Receipt subtotal: ${receipt.subtotal}
            <br />
            <br />
            Receipt tip: {receipt.tip}%
            <br />
            <br />
            Receipt total: ${receipt.total}
            <br />
            <br />
            Group: {receipt.group.groupName}
            <br />
            <br />
            <ul className='comma-list'>
              Members:
              {Object.keys(receipt.userAmounts).map(userId => (
                <li key={userId}>{receipt.userAmounts[userId].name}</li>
              ))}
            </ul>
            <br />
            <br />
            {!!rowItems.length ? (
              <div>
                Items:
                <ul
                  style={{ listStyleType: 'none', width: '100%', margin: '0' }}>
                  {rowItems.map(item => {
                    return (
                      <li>
                        Item:
                        {item.item ? item.item : ''}, Cost: $
                        {item.cost ? item.cost : ''}, Users:
                        {!item.users[0]
                          ? ''
                          : item.users.map(user => user.displayName)}
                      </li>
                    )
                  })}
                </ul>
              </div>
            ) : null}
          </div>
          <a
            onClick={this.openModal}
            style={{ color: '#7f7f7f', margin: '6px 0' }}
            className='small'>
            Delete receipt
          </a>
        </ScrollContainer>
      )
    }
  }
}

const mapState = state => ({
  receipt: state.receipts.selected,
})

const mapDispatch = dispatch => ({
  deleteReceipt: RID => dispatch(deleteReceipt(RID)),
})

export default connect(
  mapState,
  mapDispatch
)(SingleReceipt)
