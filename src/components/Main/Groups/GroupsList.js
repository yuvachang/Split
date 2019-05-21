import React, { Component } from 'react'
import Modal from '../Elements/Modal'
import SingleGroup from './SingleGroup'
import ListItem from '../Elements/ListItem'
import { isLong } from 'long'

class GroupsList extends Component {
  state = {
    viewGroup: {},
    listFadeBottom: false,
    listFadeTop: false,
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
    const { groups, deleteGroup } = this.props
    const { viewGroup, listFadeBottom, listFadeTop } = this.state
    return (
      <div id='groups-list'>
        {viewGroup.hasOwnProperty('groupName') ? (
          <div>
            <div className='button' onClick={this.viewList}>
              Back to list
            </div>
            <br />
            <SingleGroup backToList={this.viewList} group={viewGroup} />
          </div>
        ) : groups[0] ? (
          <div>
            <div>Your groups:</div>
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
              {groups.map(group => {
                return (
                  <ListItem
                    key={group.id}
                    error={false}
                    content={group}
                    clickAction={() => deleteGroup(group.id)}
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

export default GroupsList
