import React, { Component } from 'react'
import FadingScroll from './FadingScroll'
import ListItem from './ListItem'
import ScrollContainer from './ScrollContainer'
import CardListItem from './CardListItem'

class CardList extends Component {
  componentDidMount = async () => {
    console.log('listpage mounted')
  }

  render() {
    const { list, viewItem } = this.props
    return (
      <ScrollContainer>
        {list[0]
          ? list.map(item => (
              <CardListItem
                key={item.id}
                item={item}
                onClick={() => viewItem('single', item)}
              />
            ))
          : 'Nothing here...'}
      </ScrollContainer>
    )
  }
}

export default CardList
