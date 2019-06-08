import React, { Component } from 'react'
import FadingScroll from './FadingScroll'
import ListItem from '../Elements/ListItem'
import ScrollContainer from './ScrollContainer'

class ListPage extends Component {
  componentDidMount = async () => {
    console.log('listpage mounted')
    if (this.props.groups) {
      await this.props.fetchGroups()
    }

    if (this.props.friends) {
      await this.props.fetchFriends()
    }

    if (this.props.receipts) {
      await this.props.fetchReceipts()
    }
  }

  render() {
    const { receipts, groups, friends, viewItem } = this.props
    const list = groups ? groups : friends ? friends : receipts
    return (
      <ScrollContainer showButtons={true}>
        <div>
          {list[0] ? (
            <div>
              <div>
                Your {groups ? 'Groups:' : friends ? 'Friends:' : 'Receipts:'}
              </div>
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
                        : friends
                        ? './images/person.svg'
                        : './images/receipts.svg'
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
                error: groups
                  ? 'You have no groups.'
                  : friends
                  ? 'You have no friends.'
                  : 'You have no receipts.',
              }}
            />
          )}
        </div>
      </ScrollContainer>
    )
  }
}

export default ListPage
