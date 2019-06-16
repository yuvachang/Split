import * as actions from '../actions/actionTypes'

const initialState = {
  loading: false,
  error: null,
  searchResults: [],
  selected: {},
  groups: [],
  createGroupInProgress: {},
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case actions.GROUPS_LOADING:
      return { ...state, loading: true }
    case actions.GROUPS_ENDLOADING:
      return { ...state, loading: false }
    case actions.GROUPS_ERROR:
      return { ...state, error: payload, loading: false }
    case actions.GROUPS_FETCH:
      return {
        ...state,
        groups: [...payload],
        error: null,
        loading: false,
      }
    case actions.GROUPS_CREATING:
      return {
        ...state,
        createGroupInProgress: payload,
      }
    case actions.GROUPS_CREATE:
      return {
        ...state,
        groups: [...state.groups, payload],
        createGroupInProgress: {},
        error: null,
      }
    case actions.GROUPS_DELETE:
      return {
        ...state,
        groups: state.groups.filter(group => group.id !== payload),
      }
    case actions.GROUPS_SELECT:
      return { ...state, selected: payload, error: null }

    case actions.GROUPS_DESELECT:
      return {
        ...state,
        selected: {},
        error: null,
      }
    default:
      return state
  }
}
