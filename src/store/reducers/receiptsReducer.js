import * as actions from '../actions/actionTypes'

const initialState = {
  loading: false,
  error: null,
  searchResults: [],
  selected: {},
  receipts: [],
  stats: {},
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case actions.RECEIPTS_LOADING:
      return { ...state, loading: true }
    case actions.RECEIPTS_ENDLOADING:
      return { ...state, loading: false }
    case actions.RECEIPTS_ERROR:
      return { ...state, error: payload, loading: false }

    case actions.RECEIPTS_FETCH:
      return {
        ...state,
        receipts: [...payload],
        error: null,
        loading: false,
      }
    case actions.RECEIPTS_CREATE:
      return {
        ...state,
        receipts: [...state.receipts, payload],
        selected: payload,
        error: null,
      }
    case actions.RECEIPTS_DELETE:
      return {
        ...state,
        receipts: state.receipts.filter(receipt => receipt.id !== payload),
      }

    // EDITING RECEIPT
    case actions.RECEIPTS_SELECT:
      return { ...state, selected: payload, error: null }
    case actions.RECEIPTS_UPDATE:
      return {
        ...state,
        selected: payload,
        error: null,
      }

    case actions.RECEIPTS_STATS:
      return {
        ...state,
        stats: payload,
      }

    default:
      return state
  }
}
