import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  createGroup,
  createGroupInProgress,
} from '../../../store/actions/groupsActions'
import { fetchFriends } from '../../../store/actions/friendsActions'
import ScrollContainer from '../Elements/ScrollContainer'
import SelectUser from '../Elements/SelectUser'
import AddedUser from '../Elements/AddedUser'

class CreateGroup extends Component {
  state = {
    unaddedFriends: [],
    createGroup: {
      groupName: '',
      members: [],
      receipts: [],
    },
    error: null,
  }

  addMember = async member => {
    if (member.id) {
      await this.setState({
        unaddedFriends: this.state.unaddedFriends.filter(
          friend => friend.id !== member.id
        ),
        createGroup: {
          ...this.state.createGroup,
          members: [...this.state.createGroup.members, member],
        },
      })
    }
    await this.props.createGroupInProgress(this.state.createGroup)
  }

  removeMember = async member => {
    const members = this.state.createGroup.members.filter(
      addedMember => addedMember.email !== member.email
    )

    await this.setState({
      createGroup: {
        ...this.state.createGroup,
        members,
      },
    })

    await this.props.createGroupInProgress(this.state.createGroup)
  }

  handleSubmit = async e => {
    e.preventDefault()

    // validation
    const { groupName, members } = this.state.createGroup
    const existingGroupNames = this.props.groups.map(group => group.groupName)

    if (!members.length) {
      this.setState({
        error: 'Please add one or more friends.',
      })
      return
    }
    if (existingGroupNames.includes(groupName)) {
      this.setState({
        error: 'Group name already taken.',
      })
      return
    }

    // validation passed &&
    // create firestore group, reset form, return to list
    await this.props.createGroup(this.state.createGroup, this.props.currentUID)

    await this.setState({
      createGroup: {
        groupName: '',
        members: [],
        receipts: [],
      },
    })

    if (this.props.backToList) {
      this.props.backToList()
    } else if (this.props.backToForm) {
      this.props.backToForm()
    }
  }

  handleGroupName = async e => {
    await this.setState({
      createGroup: {
        ...this.state.createGroup,
        [e.target.name]: e.target.value,
      },
    })
    if (this.state.createGroup.groupName || this.state.createGroup.members) {
      await this.props.createGroupInProgress(this.state.createGroup)
    }
  }

  componentDidMount = async () => {
    await this.props.fetchFriends(this.props.currentUID)
    if (Object.keys(this.props.createGroupInProgressData)[0]) {
      let unaddedFriends = this.props.friends
      if (this.props.createGroupInProgressData.members[0]) {
        const addedMemberEmails = this.props.createGroupInProgressData.members.map(
          member => member.email
        )
        unaddedFriends = this.props.friends.filter(
          friend => !addedMemberEmails.includes(friend.email)
        )

        console.log('creategroup mounted', unaddedFriends, addedMemberEmails)
      }
      await this.setState({
        createGroup: this.props.createGroupInProgressData,
        unaddedFriends,
      })
    } else {
      await this.setState({
        unaddedFriends: this.props.friends,
      })
    }
  }

  render() {
    const { friends, loading } = this.props
    const { createGroup, error, unaddedFriends } = this.state
    const { members } = this.state.createGroup

    return (
      <ScrollContainer showButtons={true}>
        {loading && <h3>Saving...</h3>}
        <form onSubmit={this.handleSubmit} style={{ width: '75%' }}>
          <input
            className='outline-only'
            type='text'
            required={true}
            name='groupName'
            placeholder='Group name...'
            value={createGroup.groupName}
            onChange={this.handleGroupName}
            autoComplete='off'
            autoCapitalize='off'
          />
          <br />
          {unaddedFriends[0] && (
            <SelectUser addUser={this.addMember} users={unaddedFriends} />
          )}

          {members[0] &&
            members.map(member => {
              return (
                <AddedUser
                  key={member.id}
                  user={member}
                  removeUser={this.removeMember}
                />
              )
            })}
          <br />
          <button className='card' type='submit' style={{ width: '100%' }}>
            Create Group
          </button>
        </form>
      </ScrollContainer>
    )
  }
}

// export default GroupsList
const mapState = state => ({
  currentUID: state.firebase.auth.uid,
  // currentEmail: state.firebase.auth.email,
  groups: state.groups.groups,
  loading: state.groups.loading,
  friends: state.friends.friends,
  createGroupInProgressData: state.groups.createGroupInProgress,
  // selectedGroup: state.groups.selected,
})

const mapDispatch = dispatch => ({
  // fetchGroups: uid => dispatch(fetchGroups(uid)),
  createGroup: (group, uid) => dispatch(createGroup(group, uid)),
  fetchFriends: uid => dispatch(fetchFriends(uid)),
  createGroupInProgress: group => dispatch(createGroupInProgress(group)),
})

export default connect(
  mapState,
  mapDispatch
)(CreateGroup)
