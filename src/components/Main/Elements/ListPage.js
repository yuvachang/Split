import React, { Component } from 'react'
import FadingScroll from './FadingScroll'
import ListItem from '../Elements/ListItem'

class ListPage extends Component {
  componentDidMount = async () => {
    if (this.props.groups) {
      await this.props.fetchGroups()
    }

    if (this.props.friends) {
      await this.props.fetchFriends()
    }
  }

  render() {
    const { groups, friends, viewItem } = this.props
    const list = groups ? groups : friends
    return (
      <FadingScroll>
        <div>
          {list[0] ? (
            <div>
              <div>Your {groups ? 'groups:' : 'friends:'}</div>
              <br />
              {list.map(item => {
                return (
                  <ListItem
                    key={item.id}
                    error={false}
                    content={item}
                    clickAction={() => viewItem('singleView', item)}
                    leftIcon={
                      item.avatarUrl
                        ? item.avatarUrl
                        : groups
                        ? './images/people.svg'
                        : './images/person.svg'
                    }
                  />
                )
              })}
            </div>
          ) : (
            <ListItem
              key={'error-list-item'}
              error={true}
              content={{
                error: groups ? 'You have no groups.' : 'You have no friends.',
              }}
            />
          )}
        </div>
      </FadingScroll>
    )
  }
}

export default ListPage
