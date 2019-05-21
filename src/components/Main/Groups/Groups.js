import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  fetchGroups,
  createGroup,
  createGroupInProgress,
  deleteGroup
} from '../../../store/actions/groupsActions'
import { fetchFriends } from '../../../store/actions/friendsActions'
import CreateGroup from './CreateGroup'
import GroupsList from './GroupsList'

class Groups extends Component {
  state = {
    view: 'groups',
  }

  switchView = view => {
    this.setState({ view })
  }

  render() {
    const {
      groups,
      friends,
      currentUID,
      loading,
      fetchGroups,
      fetchFriends,
      createGroup,
      createGroupInProgress,
      beingCreated,
      deleteGroup
    } = this.props
    const { view } = this.state

    return (
      <div id='groups'>
        <div className='views'>
          <div
            className={
              view === 'groups' ? 'button-icon selected' : 'button-icon'
            }>
            <img
              src='./images/group.png'
              className='icon large'
              onClick={() => {
                this.switchView('groups')
              }}
            />
          </div>
          <div
            className={
              view === 'add' ? 'button-icon selected' : 'button-icon'
            }>
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
          switchView={this.switchView}
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
        {view === 'groups' && (
          <GroupsList groups={groups} fetchGroups={()=>fetchGroups(currentUID)} deleteGroup={deleteGroup}/>
        )}
      </div>
    )
  }
}

const mapState = state => ({
  currentUID: state.firebase.auth.uid,
  currentEmail: state.firebase.auth.email,
  groups: state.groups.groups,
  loading: state.groups.loading,
  friends: state.friends.friends,
  beingCreated: state.groups.beingCreated,
})

const mapDispatch = dispatch => ({
  fetchGroups: uid => dispatch(fetchGroups(uid)),
  createGroup: (group, uid) => dispatch(createGroup(group, uid)),
  fetchFriends: uid => dispatch(fetchFriends(uid)),
  createGroupInProgress: group => dispatch(createGroupInProgress(group)),
  deleteGroup: groupId => dispatch(deleteGroup(groupId)),
})

export default connect(
  mapState,
  mapDispatch
)(Groups)
