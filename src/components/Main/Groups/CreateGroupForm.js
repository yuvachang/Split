import React, { Component } from 'react'
import ListItem from '../Elements/ListItem'

class CreateGroupForm extends Component {
  state = {
    friends: [],
    // enableSearch: true,
  }

  filterFriends = (input, friendsDataArr) =>
    friendsDataArr.filter(friend => friend.index.includes(input))

  search = async () => {
    if (this.searchInput.value.length > 0) {
      // await this.setState({ enableSearch: false })
      // window.setTimeout(async () => {
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
      // friends,
      addMember,
      members,
      removeMember,
      error,
    } = this.props
    const { friends } = this.state
    const memberEmails = createGroup.members.map(member => member.email)
    return (
      <div className='form'>
        <form onSubmit={handleSubmit}>
          <label>Group Name</label>
          <input
            type='text'
            required={true}
            name='groupName'
            placeholder='Enter a group name'
            value={createGroup.groupName}
            onChange={handleChange}
          />

          <div>Group members:</div>
          <div>
            {members[0] ? (
              members.map(member => (
                <ListItem
                  key={member.email}
                  success={true}
                  content={member}
                  leftIcon={
                    member.avatarURL ? member.avatarURL : './images/person.svg'
                  }
                  rightAction={() => removeMember(member)}
                  rightIcon='./images/remove.svg'
                />
              ))
            ) : (
              <ListItem
                key={'errormessage'}
                error={true}
                content={
                  error ? { error: error } : { error: 'Add your friends.' }
                }
              />
            )}
          </div>

          <button type='submit'>Create Group</button>
        </form>
        <hr style={{ minWidth: '100%' }} />
        <br />
        <div>Add friends:</div>

        <div>
          <div className='auth-form-div'>
            <img src='./images/search.svg' className='icon' />
            <input
              type='text'
              placeholder='search friends'
              ref={node => {
                this.searchInput = node
              }}
              onChange={this.search}
            />
          </div>
          {friends[0] ? (
            friends.map(friend => {
              if (!memberEmails.includes(friend.email)) {
                return (
                  <ListItem
                    key={friend.email}
                    content={friend}
                    clickAction={() => addMember(friend)}
                    leftIcon={
                      friend.avatarURL
                        ? friend.avatarURL
                        : './images/person.svg'
                    }
                    rightIcon='./images/add.svg'
                  />
                )
              }
            })
          ) : (
            <ListItem
              key={'errormessage'}
              error={true}
              content={{ error: 'You have no friends.' }}
            />
          )}
        </div>
      </div>
    )
  }
}

export default CreateGroupForm