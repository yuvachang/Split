import React, { Component } from 'react'
import Modal from '../Elements/Modal'
import CreateGroupForm from './CreateGroupForm'
import ListItem from '../Elements/ListItem'

class GroupsList extends Component {
  state = {
    displayModal: false,
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
        error: 'Please add one or more members.',
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
    const { displayModal, createGroup } = this.state
    const { members } = this.state.createGroup
    return (
      <div id='groups-add'>
        <Modal
          display={displayModal}
          header='Confirm Add Friend'
          message={'friend details here'}
          yes='Yes'
          yesAction={async () => {}}
          cancel={this.closeModal}
        />
        <div className='scroll-div-container'>
          <div className='scroll-div'>
            {loading && <h3>Saving...</h3>}

            {this.state.error && (
              <ListItem content={{ error: this.state.error }} error={true} />
            )}

            <CreateGroupForm
              friends={friends}
              addMember={this.addMember}
              members={members}
              handleChange={this.handleChange}
              handleSubmit={this.handleSubmit}
              createGroup={createGroup}
              removeMember={this.removeMember}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default GroupsList
