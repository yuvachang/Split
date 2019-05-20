import * as actions from '../actions/actionTypes'

const initialState = {
  error: null,
  loading: false,
  verifyEmail: {
    error: null,
    loading: false,
  },
  recoverPassword: {
    error: null,
    loading: false,
  },
  profileEdit: {
    error: null,
    loading: false,
  },
  deleteUser: {
    loading: false,
    error: null,
  },
  test: {},
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case actions.AUTH_START:
      return { ...state, loading: true }
    // case actions.AUTH_SUCCESS:
    //   return {...state, loading: false, error: null}
    case actions.AUTH_END:
      return { ...state, loading: false }
    case actions.AUTH_CREDS:
      return { ...state, test: payload }
    case actions.AUTH_FAIL:
      return { ...state, error: payload }
    case actions.AUTH_SUCCESS:
      return { ...state, error: false }
    default:
      return state
  }
}
