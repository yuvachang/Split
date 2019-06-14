import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  fetchGroups,
  deleteGroup,
  selectGroup,
} from '../../../store/actions/groupsActions'
import CreateGroup from './CreateGroup'
import SingleGroup from './SingleGroup'
import CardList from '../Elements/CardList'
import TopMenu from '../Elements/TopMenu'

class Groups extends Component {
  state = {
    view: 'list',
    searchInput: '',
    groups: [],
    singleGroup: {},
  }

  switchView = async (view, group) => {
    if (group) {
      await this.props.selectGroup(group.id)

      await this.setState({
        singleGroup: this.props.selectedGroup,
        view: 'singleView',
      })
    } else {
      this.setState({ view })
    }
  }

  filterGroups = (input, groupsDataArr) =>
    groupsDataArr.filter(group =>
      group.groupName.toLowerCase().includes(input.toLowerCase())
    )

  search = async e => {
    if (e.target.value.length > 0) {
      const results = this.filterGroups(e.target.value, this.props.groups)
      await this.setState({ groups: results, searchInput: e.target.value })
    } else {
      await this.setState({ groups: this.props.groups, searchInput: '' })
    }
  }

  componentDidUpdate = async prevProps => {
    if (prevProps.groups !== this.props.groups) {
      await this.setState({
        groups: this.props.groups,
      })
    }
  }

  componentDidMount = async () => {
    await this.props.fetchGroups(this.props.currentUID)

    await this.setState({
      groups: this.props.groups,
    })
  }

  render() {
    const { loading, deleteGroup } = this.props
    const { view, searchInput, singleGroup, groups } = this.state

    return (
      <div id='groups'>
        <TopMenu
          view={view}
          searchPlaceholder='Find a group...'
          search={this.search}
          b1Src='/images/list.svg'
          b1Click={() => this.switchView('list')}
          b2Src='/images/add.svg'
          b2Click={() => this.switchView('add')}
        />

        {view === 'list' && (
          <div>
            <br />
            {searchInput ? `Searching for '${searchInput}':` : 'Your groups:'}
          </div>
        )}

        {view === 'list' && (
          <CardList list={groups} switchView={this.switchView} />
        )}

        {view === 'singleView' && (
          <SingleGroup
            backToList={() => this.switchView('list')}
            group={singleGroup}
            deleteGroup={deleteGroup}
            loading={loading}
          />
        )}

        {view === 'add' && (
          <div>
            <br /> Create a group:
          </div>
        )}
        {view === 'add' && (
          <CreateGroup backToList={() => this.switchView('list')} />
        )}
      </div>
    )
  }
}

const mapState = state => ({
  currentUID: state.firebase.auth.uid,
  groups: state.groups.groups,
  selectedGroup: state.groups.selected,
})

const mapDispatch = dispatch => ({
  fetchGroups: uid => dispatch(fetchGroups(uid)),
  deleteGroup: groupId => dispatch(deleteGroup(groupId)),
  selectGroup: groupId => dispatch(selectGroup(groupId)),
})

export default connect(
  mapState,
  mapDispatch
)(Groups)
