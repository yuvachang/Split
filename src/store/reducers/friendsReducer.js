import * as actions from '../actions/actionTypes'

const initialState = {
  loading: false,
  error: null,
  selected: {},
  friends: [],
  pending: {
    confirmed: [],
    madeRequest: [],
    receivedRequest: [],
  },
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case actions.FRIENDS_LOADING:
      return { ...state, loading: true }
    case actions.FRIENDS_ENDLOADING:
      return { ...state, loading: false }
    case actions.FRIENDS_ERROR:
      return { ...state, error: payload, loading: false }
    case actions.FRIENDS_LIST:
      return {
        ...state,
        friends: payload,
        error: null,
        // loading: false,
      }
    case actions.FRIENDS_ADD:
      return {
        ...state,
        friends: [...state.friends, payload],
        error: null,
        loading: false,
      }
    case actions.FRIENDS_REMOVE:
      return {
        ...state,
        loading: false,
        friends: state.friends.filter(friend => friend.email !== payload),
      }

    case actions.FRIENDS_SELECT:
      return { ...state, selected: payload, error: null }

    case actions.FRIENDS_PENDING:
      return {
        ...state,
        pending: payload,
      }

    case actions.FRIENDS_MADE_REQUEST:
      return {
        ...state,
        loading: false,
        pending: {
          ...state.pending,
          madeRequest: [...state.pending.madeRequest, payload]
        }
      }

    case actions.FRIENDS_CANCEL_REQUEST:
      return {
        ...state,
        loading: false,
        pending: {
          ...state.pending,
          madeRequest: state.pending.madeRequest.filter(
            user => user.id !== payload
          ),
        },
      }

    case actions.FRIENDS_CLEARCONFIRM:
      return {
        ...state,
        pending: {
          ...state.pending,
          confirmed: state.pending.confirmed.filter(
            user => user.id !== payload
          ),
        },
      }

    default:
      return state
  }
}
