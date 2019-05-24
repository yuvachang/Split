import React, { Component } from 'react'
import { connect } from 'react-redux'
import Modal from '../Elements/Modal'
import ListItem from '../Elements/ListItem'
import FadingScroll from '../Elements/FadingScroll'
import { fetchGroups } from '../../../store/actions/groupsActions'
import { fetchReceipts } from '../../../store/actions/receiptsActions'
import DropDownList from '../Elements/DropDownList';

class CreateReceipt extends Component {
  state = {
    rows: 0,
    groupId: null,
    payer: {},

    error: null,
  }

  // handleSubmit = async e => {
  //   e.preventDefault()
  //   //validation
  //   if (!this.state.createGroup.members.length) {
  //     this.setState({
  //       error: 'Please add one or more members.',
  //     })
  //     return
  //   }

  //   const newReceipt = await this.props.createReceipt(this.state)

  //   await this.setState({
  //     createGroup: {
  //       groupName: '',
  //       members: [],
  //       receipts: [],
  //     },
  //   })

  //   this.props.backToList('singleView', newReceipt)
  // }

  // handleChange = async e => {
  //   await this.setState({
  //     createGroup: {
  //       ...this.state.createGroup,
  //       [e.target.name]: e.target.value,
  //     },
  //   })
  //   if (this.state.createGroup.groupName || this.state.createGroup.members) {
  //     await this.props.createGroupInProgress(this.state.createGroup)
  //   }
  // }

  componentDidMount = async () => {
    await this.props.fetchGroups(this.props.currentUID)
    // if (Object.keys(this.props.beingCreated)[0]) {
    //   this.setState({
    //     createGroup: this.props.beingCreated,
    //   })
    // }
  }

  render() {
    const { friends, groups, fetchGroups, loading } = this.props
    const { displayModal, createGroup } = this.state
    // const { members } = this.state.createGroup
    return (
      <div id='groups-add'>
        {/* <Modal
          display={displayModal}
          header='Confirm Add Friend'
          message={'friend details here'}
          yes='Yes'
          yesAction={async () => {}}
          cancel={this.closeModal}
        /> */}
        <FadingScroll>
          {loading && <h3>Saving...</h3>}

          {this.state.error && (
            <ListItem content={{ error: this.state.error }} error={true} />
          )}

          <DropDownList listContent={groups} />

          {/* <CreateGroupForm
            friends={friends}
            addMember={this.addMember}
            members={members}
            handleChange={this.handleChange}
            handleSubmit={this.handleSubmit}
            createGroup={createGroup}
            removeMember={this.removeMember}
          /> */}

          <p>CONTENT BLAHBLAHBLAH</p>
          <p>CONTENT BLAHBLAHBLAH</p>
          <p>CONTENT BLAHBLAHBLAH</p>
          <p>CONTENT BLAHBLAHBLAH</p>
          <p>CONTENT BLAHBLAHBLAH</p>
          <p>CONTENT BLAHBLAHBLAH</p>
          <p>CONTENT BLAHBLAHBLAH</p>
          <p>CONTENT BLAHBLAHBLAH</p>
          <p>CONTENT BLAHBLAHBLAH</p>
          <p>CONTENT BLAHBLAHBLAH</p>
          <p>CONTENT BLAHBLAHBLAH</p>
          <p>CONTENT BLAHBLAHBLAH</p>
          <p>CONTENT BLAHBLAHBLAH</p>
          <p>CONTENT BLAHBLAHBLAH</p>
          <p>CONTENT BLAHBLAHBLAH</p>
          <p>CONTENT BLAHBLAHBLAH</p>
          <p>CONTENT BLAHBLAHBLAH</p>
          <p>CONTENT BLAHBLAHBLAH</p>
          <p>CONTENT BLAHBLAHBLAH</p>
          <p>CONTENT BLAHBLAHBLAH</p>


        </FadingScroll>
      </div>
    )
  }
}

const mapState = state => ({
  currentUID: state.firebase.auth.uid,
  currentEmail: state.firebase.auth.email,
  receipts: state.receipts.receipts,
  loading: state.receipts.loading,
  beingCreated: state.receipts.beingCreated,
  groups: state.groups.groups,
})

const mapDispatch = dispatch => ({
  fetchReceipts: uid => dispatch(fetchReceipts(uid)),
  fetchGroups: uid => dispatch(fetchGroups(uid)),
})

export default connect(
  mapState,
  mapDispatch
)(CreateReceipt)
