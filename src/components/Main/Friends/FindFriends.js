import React, { Component } from 'react'
import ListItem from '../Elements/ListItem'
import Modal from '../Elements/Modal'
import FadingScroll from '../Elements/FadingScroll'

// needs to be class component to have ref on input node
class FindFriends extends Component {
  state = {
    enableSearch: true,
    searchResults: [],
    displayModal: false,
    person: {},
    added: '',
  }

  search = async () => {
    const { currentEmail, friends, findPerson } = this.props
    console.log(currentEmail)
    if (this.searchInput.value.length > 2 && !!this.state.enableSearch) {
      await this.setState({ enableSearch: false })
      window.setTimeout(async () => {
        const results = await findPerson(
          this.searchInput.value,
          currentEmail,
          friends
        )
        await this.setState({ searchResults: results, enableSearch: true })
      }, 800)
    }
  }

  openModal = async person => {
    await this.setState({ displayModal: true, person })
  }

  handleAdd = async person => {
    const newResults = this.state.searchResults.filter(
      result => result.email !== person.email
    )
    await this.setState({
      searchResults: newResults,
      added: `Request sent to ${person.displayName}!`,
    })
  }

  closeModal = async () => {
    await this.setState({ displayModal: false, person: {} })
  }

  render() {
    const { displayModal, person, searchResults, added } = this.state

    const { makeFriendRequest, currentUID, loading } = this.props

    return (
      <div id='friends-add'>
        <Modal
          display={displayModal}
          header='Confirm Add Friend'
          message={`Add ${this.state.person.displayName} as a friend?`}
          yesMsg='Yes'
          yesAction={async () => {
            await makeFriendRequest(person.email, currentUID)
            await this.handleAdd(person)
          }}
          noMsg='Cancel'
          noAction={this.closeModal}
        />
        <div>Search for friends:</div>
        <br />
        <div>
          <input
            type='text'
            placeholder='name or email'
            ref={node => {
              this.searchInput = node
            }}
            onChange={this.search}
          />
        </div>
        <br />
        {loading && <div>Loading.</div>}
        {added && <div>{added}</div>}
        <br />
        <FadingScroll styles={{ height: 'calc(100vh - 350px)' }}>
          {searchResults.map(person =>
            person.error ? (
              <ListItem key={person.error} error={true} content={person} />
            ) : (
              <ListItem
                key={person.email}
                error={false}
                content={person}
                clickAction={this.openModal}
                leftIcon={'./images/person.svg'}
                rightIcon={'./images/add.svg'}
                success={!!person.added}
              />
            )
          )}
        </FadingScroll>
      </div>
    )
  }
}

export default FindFriends
