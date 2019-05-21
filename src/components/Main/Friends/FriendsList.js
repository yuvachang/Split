import React, { Component } from 'react'
import SingleFriend from './SingleFriend'
import ListItem from '../Elements/ListItem'

class FriendsList extends Component {
  state = {
    viewFriend: {},
  }

  viewFriend = friend => {
    this.setState({ viewFriend: friend })
  }

  viewList = () => {
    this.setState({ viewFriend: {} })
  }

  componentDidMount = async () => {
    await this.props.fetchFriends()
  }

  render() {
    const { friends } = this.props
    const { viewFriend } = this.state
    return (
      <div id='friends-list'>
        {viewFriend.hasOwnProperty('email') ? (
          <div>
             <div className='button' onClick={this.viewList}>
              Back to list
            </div>
            <br/>
            <SingleFriend backToList={this.viewList} friend={viewFriend}/>
            
           
          </div>
        ) : friends[0] ? (
          <div>
            <div>Your friends:</div>
            <br />
            {friends.map(friend => {
              return (
                <ListItem
                  key={friend.email}
                  error={false}
                  content={friend}
                  clickAction={this.viewFriend}
                  leftIcon={
                    friend.avatarURL ? friend.avatarURL : './images/person.svg'
                  }
                />
              )
            })}
          </div>
        ) : (
          <ListItem key={'error-list-item'} error={true} content={{error: 'You have no friends.'}} />
        )}
      </div>
    )
  }
}

export default FriendsList
