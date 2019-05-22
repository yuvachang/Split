import React, { Component } from 'react'
import ListItem from '../Elements/ListItem'

class ListPage extends Component {
  state = {
    listFadeBottom: false,
    listFadeTop: false,
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

    if (this.props.groups) {
      await this.props.fetchGroups()
    }
    
    if (this.props.friends) {
      await this.props.fetchFriends() 
    }

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
    const { groups, friends, viewItem } = this.props
    const { listFadeBottom, listFadeTop } = this.state
    const list = groups ? groups : friends
    return (
      <div id='groups-list'>
        { list[0] ? (
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
              ref={node=>{this.list=node}}>
              <br />
              {list.map(item => {
                return (
                  <ListItem
                    key={item.id}
                    error={false}
                    content={item}
                    clickAction={()=>viewItem('singleView', item)}
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
            content={{ error: 'You have no groups.' }}
          />
        )}
      </div>
    )
  }
}

export default ListPage
