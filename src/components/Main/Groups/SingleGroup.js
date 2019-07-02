import React, { Component } from 'react'
import Modal from '../Elements/Modal'
import ScrollContainer from '../Elements/ScrollContainer'

class SingleGroup extends Component {
  state = {
    displayModal: false,
  }

  openModal = async () => {
    await this.setState({ displayModal: true })
  }

  closeModal = async () => {
    await this.setState({
      displayModal: false,
    })
  }

  render() {
    const { group, deleteGroup, backToList } = this.props
    const { displayModal } = this.state
    console.log(group.receipts.map(r => r.total).reduce((a, b) => a + b))
    return (
      <ScrollContainer>
        <Modal
          display={displayModal}
          message={`Delete ${group.groupName} forever?`}
          yesAction={async () => {
            await deleteGroup(group.id)
            this.closeModal()
            backToList()
          }}
          noAction={this.closeModal}
        />

        <h3>{group.groupName}</h3>
        <br />
        <div style={{ textAlign: 'left' }}>
          Receipts total: $
          {!!group.receipts.length
            ? group.receipts.map(r => r.total).reduce((a, b) => a + b)
            : 0}
          <br />
          <br />
          Receipts:{' '}
          {!!group.receipts.length ? (
            <ul style={{ listStyleType: 'none', width: '100%', margin: '0' }}>
              {group.receipts.map(receiptObj => {
                return <li key={receiptObj.id}>{receiptObj.receiptName}</li>
              })}
            </ul>
          ) : (
            'No receipts.'
          )}
          <br />
          <br />
          {!!group.members.length ? (
            <div>
              Members:
              <ul
                style={{
                  listStyleType: 'none',
                  width: '100%',
                  margin: '0',
                  textAlign: '',
                }}>
                {group.members.map(member => {
                  return <li key={member.id}>{member.displayName}</li>
                })}
              </ul>
            </div>
          ) : null}
        </div>
        <br />
        <div
          onClick={this.openModal}
          style={{ color: '#7f7f7f', margin: '6px 0' }}
          className='alink small'>
          Delete receipt
        </div>
      </ScrollContainer>
    )
  }
}

export default SingleGroup
