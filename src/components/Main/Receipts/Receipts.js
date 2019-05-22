import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  fetchReceipts,
  createGroup,
  createGroupInProgress,
  deleteGroup,
} from '../../../store/actions/receiptsActions'

class Receipts extends Component {
  state = {
    view: 'list',
    singleReceipt: {},
  }

  switchView = (view, group) => {
    if (group) {
      this.setState({
        singleGroup: group,
        view: 'singleView',
      })
    } else {
      this.setState({ view })
    }
  }

  render() {
    const {
      groups,
      receipts,
      currentUID,
      loading,
      fetchReceipts,
      fetchFriends,
      createGroup,
      createGroupInProgress,
      beingCreated,
      deleteGroup,
    } = this.props
    const { view, singleGroup } = this.state

    return (
      <div id='groups'>
        <div className='views'>
          <div
            className={
              view === 'list' ? 'button-icon selected' : 'button-icon'
            }>
            <img
              src='./images/group.png'
              className='icon large'
              onClick={() => {
                this.switchView('list')
              }}
            />
          </div>
          <div
            className={view === 'add' ? 'button-icon selected' : 'button-icon'}>
            <img
              src='./images/add.svg'
              className='icon large'
              onClick={() => this.switchView('add')}
            />
          </div>
        </div>
        <hr />
        <br />
        {view === 'add' && (
          <CreateGroup
            backToList={() => this.switchView('list')}
            groups={groups}
            currentUID={currentUID}
            loading={loading}
            createGroup={createGroup}
            friends={friends}
            fetchFriends={fetchFriends}
            createGroupInProgress={createGroupInProgress}
            beingCreated={beingCreated}
          />
        )}
        {view === 'list' && (
          <ListPage
            groups={groups}
            fetchReceipts={() => fetchReceipts(currentUID)}
            viewItem={this.switchView}
          />
        )}

        {view === 'singleView' && (
          <div id='groups-list'>
            <SingleGroup
              backToList={() => this.switchView('list')}
              group={singleGroup}
              deleteGroup={deleteGroup}
              loading={loading}
            />
          </div>
        )}
      </div>
    )
  }
}

const mapState = state => ({
  currentUID: state.firebase.auth.uid,
  currentEmail: state.firebase.auth.email,
  receipts: state.receipts.receipts,
  loading: state.receipts.loading,
  beingCreated: state.receipts.beingCreated,
})

const mapDispatch = dispatch => ({
  fetchReceipts: uid => dispatch(fetchReceipts(uid)),
  createGroup: (group, uid) => dispatch(createGroup(group, uid)),
  fetchFriends: uid => dispatch(fetchFriends(uid)),
  createGroupInProgress: group => dispatch(createGroupInProgress(group)),
  deleteGroup: groupId => dispatch(deleteGroup(groupId)),
})

export default connect(
  mapState,
  mapDispatch
)(Receipts)
