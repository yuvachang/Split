import React, { Component } from 'react'
import CreateReceipt from './CreateReceipt'
import CreateGroup from '../Groups/CreateGroup'

const styles = {
  page: {
    width: '100%',
    height: '100%',
    display: 'flex',
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
    const showMenu = window.location.pathname === '/receipts/create'
    return (
      <div style={styles.page}>
        {showMenu && <div className='menu'>Create a Receipt</div>}
        {showMenu && <br/>}
        {showCreateGroup && <CreateGroup backToForm={this.toggleCreateGroup} />}
        {!showCreateGroup && <CreateReceipt toggleCreateGroup={this.toggleCreateGroup}/>}
      </div> 
    )
  }
}

export default AddReceiptPage
