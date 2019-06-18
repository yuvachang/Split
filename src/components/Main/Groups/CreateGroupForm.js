import React, { Component } from 'react'
import CardListItem from '../Elements/CardListItem'
import SelectUser from '../Elements/SelectUser'

class CreateGroupForm extends Component {
  state = {
    friends: [],
  }

  filterFriends = (input, friendsDataArr) =>
    friendsDataArr.filter(friend => friend.index.includes(input))

  search = async () => {
    if (this.searchInput.value.length > 0) {
      const results = this.filterFriends(
        this.searchInput.value,
        this.props.friends
      )
      await this.setState({ friends: results })
      // }, 800)
    } else {
      await this.setState({ friends: this.props.friends })
    }
  }

  componentDidUpdate = async prevProps => {
    if (prevProps.friends !== this.props.friends) {
      await this.setState({
        friends: this.props.friends,
      })
    }
  }

  componentDidMount = async () => {
    await this.setState({
      friends: this.props.friends,
    })
  }

  render() {
    const {
      handleChange,
      handleSubmit,
      createGroup,
      addMember,
      members,
    } = this.props
    const { friends } = this.state

    const unaddedFriends = friends.filter(
      friend => !addedMemberEmails.includes(friend.email)
    )

    return (
      <div className='form'>
        <form onSubmit={handleSubmit}>
          <input
            className='outline-only'
            type='text'
            required={true}
            name='groupName'
            placeholder='Group name...'
            value={createGroup.groupName}
            onChange={handleChange}
            autoComplete='off'
            autoCapitalize='off'
          />
          <br />

          <SelectUser
            addUser={addMember}
            users={unaddedFriends}
          />
          <br />

          <div className='added-friends'>
            {members[0]
              ? members.map(member => (
                  <div className='added-list-item'>
                    <CardListItem
                      key={member.email}
                      item={member}
                      leftIcon='/images/person.svg'
                    />
                  </div>
                ))
              : null}
          </div>

          <button type='submit'>Create Group</button>
        </form>
      </div>
    )
  }
}

export default CreateGroupForm
