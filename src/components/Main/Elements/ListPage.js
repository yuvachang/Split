import React, { Component } from 'react'
import Modal from '../Elements/Modal'
import SingleGroup from './SingleGroup'
import ListItem from '../Elements/ListItem'

class ListPage extends Component {
  state = {
    viewListItem: {},
    listFadeBottom: false,
    listFadeTop: false,
  }

  viewFriend = friend => {
    this.setState({ viewFriend: friend })
  }

  viewList = () => {
    this.setState({ viewFriend: {} })
  }

  closeModal = async () => {
    await this.setState({ displayModal: false, person: {} })
  }

  scrollListener = e => {
    const atBottom =
      this.list.scrollTop + this.list.clientHeight >=
      this.list.scrollHeight - 10
    const atTop = this.list.scrollTop <= 10
    console.log(atTop)

    if (atTop && this.state.listFadeTop) {
      this.setState({ listFadeTop: false })
    }

    if (!atTop && !this.state.listFadeTop) {
      this.setState({ listFadeTop: true })
    }

    if (atBottom && this.state.listFadeBottom) {
      this.setState({ listFadeBottom: false })
    }

    if (!atBottom && !this.state.listFadeBottom) {
      this.setState({ listFadeBottom: true })
    }
  }

  componentDidMount = async () => {
    await this.props.fetchGroups()

    if (this.list) {
      this.list.addEventListener('scroll', e => this.scrollListener(e))
      const isLongList = this.list.scrollHeight > this.list.clientHeight
      if (isLongList) {
        await this.setState({
          listFadeBottom: true,
        })
      }
    }
  }

  componentWillUnmount() {
    if (this.list) {
      this.list.removeEventListener('scroll', e => this.scrollListener(e))
    }
  }

  render() {
    const { groups, friends } = this.props
    const { viewListItem, listFadeBottom, listFadeTop } = this.state
    const list = groups ? groups : friends
    return (
      <div id='groups-list'>
        {viewListItem.hasOwnProperty('id') ? (
          <div>
            <div className='button' onClick={this.viewList}>
              Back to list
            </div>
            <br />
            {groups && (
              <SingleGroup backToList={this.viewList} group={viewListItem} />
            )}
            {friends && (
              <SingleFriend backToList={this.viewList} friend={viewListItem} />
            )}
          </div>
        ) : list[0] ? (
          <div>
            <div>Your {groups ? 'groups:' : 'friends:'}</div>
            <br />
            <div
              className={
                listFadeBottom && listFadeTop
                  ? 'actual-list fade-top fade-bottom'
                  : listFadeBottom
                  ? 'actual-list fade-bottom'
                  : listFadeTop
                  ? 'actual-list fade-top'
                  : 'actual-list'
              }
              ref={node => (this.list = node)}>
              <br />
              {list.map(item => {
                return (
                  <ListItem
                    key={item.id}
                    error={false}
                    content={item}
                    clickAction={this.viewList}
                    leftIcon={
                      group.avatarURL ? group.avatarURL : './images/people.svg'
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
            content={{ error: 'You have no groups.' }}
          />
        )}
      </div>
    )
  }
}

export default ListPage
