import React, { Component } from 'react'
import CreateReceipt from './CreateReceipt'
import TopMenu from '../Elements/TopMenu'
import ReceiptHeader from './ReceiptHeader'
import CreateGroup from '../Groups/CreateGroup'
import ScrollContainer from '../Elements/ScrollContainer'

const styles = {
  page: {
    width: '100%',
    height: '100%',
    display: 'flex',
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    flexDirection: 'column',
    textAlign: 'center',
  },
  button: {
    maxWidth: '225px',
    minHeight: '25px',
    height: '30px',
    color: '#595959',
    fontSize: '0.9em',
    transform: 'translateY(10px)',
  },
}

class AddReceiptPage extends Component {
  state = {
    showCreateGroup: false,
  }

  toggleCreateGroup = () => {
    this.setState({
      showCreateGroup: !this.state.showCreateGroup,
    })
  }

  render() {
    const { showCreateGroup } = this.state
    return (
      <div style={styles.page}>
        <div className='menu'>Create a Receipt</div>
        <br />
        <div
          className='button card'
          style={styles.button}
          onClick={this.toggleCreateGroup}>
          {showCreateGroup ? 'Back to receipt form' : 'Create a group'}
        </div>
        {showCreateGroup && <CreateGroup backToForm={this.toggleCreateGroup} />}
        {!showCreateGroup && <CreateReceipt />}
      </div>
    )
  }
}

export default AddReceiptPage
