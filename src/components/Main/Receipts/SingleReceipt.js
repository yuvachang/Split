import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { deleteReceipt } from '../../../store/actions/receiptsActions'
import Modal from '../Elements/Modal'
import ScrollContainer from '../Elements/ScrollContainer'

class SingleReceipt extends Component {
  state = {
    displayModal: false,
    showDropdown: false,
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

  render() {
    if (!this.props.receipt.id) {
      return <h3>Error: No receipt selected.</h3>
    } else {
      const { receipt, deleteReceipt, backToList } = this.props
      const { displayModal, showDropdown } = this.state
      return (
        <ScrollContainer>
          <Modal
            display={displayModal}
            message={`Delete ${receipt.receiptName} forever?`}
            yesAction={async () => {
              await deleteReceipt(receipt.id)
              this.closeModal()
              backToList()
            }}
            noAction={this.closeModal}
          />
          <div className='profile'>
            <h3>{receipt.receiptName}</h3>
            <img
              src='./images/down-arrow.svg'
              className={showDropdown ? 'icon upsidedown grey' : 'icon grey'}
              onClick={this.toggleDropdown}
            />
          </div>
          <div
            className={showDropdown ? 'profile-menu' : 'profile-menu hidden'}>
            <Link to={`/receipts/${receipt.id}`}>
              <img src='./images/edit.svg' className='icon grey' />
            </Link>
            <img
              src='./images/trash.svg'
              className='icon grey'
              onClick={this.openModal}
            />
          </div>
          <div style={{ margin: '3px 0px' }}>
            Group: {receipt.group.groupName}
            <br />
            <ul className='comma-list'>
              Members:
              {Object.keys(receipt.userAmounts).map(userId => (
                <li key={userId}>{receipt.userAmounts[userId].name}</li>
              ))}
            </ul>
          </div>
          <br />
          Items:
          <ul style={{ listStyleType: 'none', width: '100%', margin: '0' }}>
            {Object.keys(receipt.rows).map(rowIdx => {
              return (
                <li key={rowIdx} style={{ margin: '3px 0px' }}>
                  Item:{' '}
                  {receipt.rows[rowIdx].item
                    ? receipt.rows[rowIdx].item
                    : 'n/a'}
                  , Cost: ${' '}
                  {receipt.rows[rowIdx].cost
                    ? receipt.rows[rowIdx].cost
                    : 'n/a'}
                  , Users:{' '}
                  {!receipt.rows[rowIdx].users[0]
                    ? 'n/a'
                    : receipt.rows[rowIdx].users.map(user => user.displayName)}
                </li>
              )
            })}
          </ul>
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
