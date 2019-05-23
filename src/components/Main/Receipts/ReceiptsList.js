import React, { Component } from 'react'
import ListItem from '../Elements/ListItem'

class ListPage extends Component {
  state = {
    listFadeBottom: false,
    listFadeTop: false,
  }

  componentDidMount = async () => {
    await this.props.fetchReceipts()
  }

  componentWillUnmount() {
    if (this.list) {
      this.list.removeEventListener('scroll', e => this.scrollListener(e))
    }
  }

  render() {
    const { groups, friends, viewItem } = this.props
    const { listFadeBottom, listFadeTop } = this.state
    const list = groups ? groups : friends
    return (
      <div className='scroll-div-container'>
        {list[0] ? (
          <div>
            <div>Your {groups ? 'groups:' : 'friends:'}</div>
            <div
              className={
                listFadeBottom && listFadeTop
                  ? 'scroll-div fade-top fade-bottom'
                  : listFadeBottom
                  ? 'scroll-div fade-bottom'
                  : listFadeTop
                  ? 'scroll-div fade-top'
                  : 'scroll-div'
              }
              ref={node => {
                this.list = node
              }}>
              <br />
              {list.map(item => {
                return (
                  <ListItem
                    key={item.id}
                    error={false}
                    content={item}
                    clickAction={() => viewItem('singleView', item)}
                    leftIcon={
                      item.avatarURL
                        ? item.avatarURL
                        : groups
                        ? './images/people.svg'
                        : './images/person.svg'
                    }
                  />
                )
              })}
            </div>
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
    )
  }
}

export default ListPage
