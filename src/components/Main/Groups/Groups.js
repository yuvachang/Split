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
        <div className='menu'>
          <div className='search-div'>
            {/* <label>Last Name:</label> */}
            <img src='./images/search.svg' className='icon' />
            <input
              placeholder='Search your groups...'
              type='text'
              name='lastName'
              // value={lastName}
              // onChange={handleChange}
              // required={authType === 'signup' ? true : false}
            />
          </div>
          <div className='menu-views'>
            <div
              className={view === 'list' ? 'icon round selected' : 'icon round'}
              onClick={() => this.switchView('list')}>
              <img
                src='/images/list.svg'
                className='icon'
                style={
                  view === 'list'
                    ? { filter: 'invert(1)' }
                    : { filter: 'invert(0.4)' }
                }
              />
              <img
                src='/images/list-orange.svg'
                className='icon round orange'
                style={{ opacity: '0', position: 'absolute' }}
              />
            </div>

            <div
              className={view === 'add' ? 'icon round selected' : 'icon round'}
              onClick={() => this.switchView('add')}>
              <img
                src='/images/add.svg'
                className='icon'
                style={
                  view === 'add'
                    ? { filter: 'invert(1)' }
                    : { filter: 'invert(0.4)' }
                }
              />
            </div>
          </div>
        </div>

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
