import React from 'react'
import ListItem from '../Elements/ListItem'

const CreateGroupForm = ({
  handleChange,
  handleSubmit,
  createGroup,
  friends,
  addMember,
  members,
  removeMember,
}) => {
  const memberEmails = createGroup.members.map(member => member.email)

  return (
    <div className='form'>
      <div>Your friends:</div>
      <div className='add-friends-list'>
        {friends[0] ? (
          friends.map(friend => {
            if (!memberEmails.includes(friend.email)) {
              return (
                <ListItem
                  key={friend.email}
                  content={friend}
                  clickAction={() => addMember(friend)}
                  leftIcon={
                    friend.avatarURL ? friend.avatarURL : './images/person.svg'
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
      <hr style={{ minWidth: '100%' }} />
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
          {members[0]
            ? members.map(member => (
                <ListItem
                  key={member.email}
                  success={true}
                  content={member}
                  clickAction={removeMember}
                  leftIcon={
                    member.avatarURL ? member.avatarURL : './images/person.svg'
                  }
                  rightIcon='./images/remove.svg'
                />
              ))
            : null}
        </div>

        <button type='submit'>Create Group</button>
      </form>
    </div>
  )
}

export default CreateGroupForm
