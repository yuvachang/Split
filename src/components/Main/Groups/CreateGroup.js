import React, { Component } from 'react'
import Modal from '../Elements/Modal'
import CreateGroupForm from './CreateGroupForm'
import ListItem from '../Elements/ListItem'
import FadingScroll from '../Elements/FadingScroll'

class GroupsList extends Component {
  state = {
    createGroup: {
      groupName: '',
      members: [],
      receipts: [],
    },
    error: null,
  }

  addMember = member => {
    this.setState({
      createGroup: {
        ...this.state.createGroup,
        members: [...this.state.createGroup.members, member],
      },
    })
  }

  removeMember = member => {
    const members = this.state.createGroup.members.filter(
      addedMember => addedMember.email !== member.email
    )

    this.setState({
      createGroup: {
        ...this.state.createGroup,
        members,
      },
    })
  }

  handleSubmit = async e => {
    e.preventDefault()
    //validation
    if (!this.state.createGroup.members.length) {
      this.setState({
        error: 'Please add one or more friends.',
      })
      return
    }

    await this.props.createGroup(this.state.createGroup, this.props.currentUID)

    await this.setState({
      createGroup: {
        groupName: '',
        members: [],
        receipts: [],
      },
    })

    this.props.backToList()
  }

  handleChange = async e => {
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
    if (Object.keys(this.props.beingCreated)[0]) {
      this.setState({
        createGroup: this.props.beingCreated,
      })
    }
  }

  render() {
    const { friends, groups, fetchGroups, loading } = this.props
    const { displayModal, createGroup, error } = this.state
    const { members } = this.state.createGroup
    return (
      <div id='groups-add'>
        <FadingScroll>
          {loading && <h3>Saving...</h3>}

          <CreateGroupForm
            friends={friends}
            error={error}
            addMember={this.addMember}
            members={members}
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit}
            createGroup={createGroup}
            removeMember={this.removeMember}
          />
        </FadingScroll>
      </div>
    )
  }
}

export default GroupsList
