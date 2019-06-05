import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  fetchGroups,
  createGroup,
  createGroupInProgress,
  deleteGroup,
  selectGroup,
} from '../../../store/actions/groupsActions'
import { fetchFriends } from '../../../store/actions/friendsActions'
import CreateGroup from './CreateGroup'
import ListPage from '../Elements/ListPage'
import SingleGroup from './SingleGroup'

class Groups extends Component {
  state = {
    view: 'list',
    singleGroup: {},
  }

  switchView = async (view, group) => {
    if (group) {
      await this.props.selectGroup(group.id)

      await this.setState({
        singleGroup: this.props.selectedGroup,
        view: 'singleView',
      })
    } else {
      this.setState({ view })
    }
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
            fetchGroups={() => fetchGroups(currentUID)}
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
  groups: state.groups.groups,
  loading: state.groups.loading,
  friends: state.friends.friends,
  beingCreated: state.groups.beingCreated,
  selectedGroup: state.groups.selected,
})

const mapDispatch = dispatch => ({
  fetchGroups: uid => dispatch(fetchGroups(uid)),
  createGroup: (group, uid) => dispatch(createGroup(group, uid)),
  fetchFriends: uid => dispatch(fetchFriends(uid)),
  createGroupInProgress: group => dispatch(createGroupInProgress(group)),
  deleteGroup: groupId => dispatch(deleteGroup(groupId)),
  selectGroup: groupId => dispatch(selectGroup(groupId)),
})

export default connect(
  mapState,
  mapDispatch
)(Groups)