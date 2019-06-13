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
import CardList from '../Elements/CardList'

class Groups extends Component {
  state = {
    view: 'list',
    groups: [],
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

  filterGroups = (input, groupsDataArr) =>
    groupsDataArr.filter(group =>
      group.groupName.toLowerCase().includes(input.toLowerCase())
    )

  search = async e => {
    if (e.target.value.length > 0) {
      const results = this.filterGroups(e.target.value, this.props.groups)
      await this.setState({ groups: results })
    } else {
      await this.setState({ groups: this.props.groups })
    }
  }

  componentDidMount = async () => {
    await this.props.fetchGroups(this.props.currentUID)
    await this.setState({
      groups: this.props.groups,
    })
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
          <div className={view === 'list' ? 'search-div' : 'search-div hidden'}>
            <img src='./images/search.svg' className='icon grey' />
            <input
              placeholder='Find a group...'
              type='text'
              name='lastName'
              onChange={this.search}
            />
          </div>
          <div className='menu-views'>
            <div
              className={`round-icon-button ${
                view === 'list' ? 'selected' : ''
              }`}
              onClick={() => this.switchView('list')}>
              <img
                src='/images/list.svg'
                className='icon'
                style={view === 'list' ? {} : { filter: 'invert(0.4)' }}
              />
            </div>

            <div
              className={`round-icon-button ${
                view === 'add' ? 'selected' : ''
              }`}
              onClick={() => this.switchView('add')}>
              <img
                src='/images/add.svg'
                className='icon'
                style={view === 'add' ? {} : { filter: 'invert(0.4)' }}
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
          <div>
            {' '}
            <br /> Your groups:
          </div>
        )}
        {view === 'list' && (
          <CardList list={this.state.groups} viewItem={this.switchView} />
        )}

        {/* {view === 'list' && (
          <ListPage
            groups={groups}
            fetchGroups={() => fetchGroups(currentUID)}
            viewItem={this.switchView}
          />
        )} */}

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
