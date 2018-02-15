import { FETCH_ADMINS } from '../actions';

export default (state = null, action) => {
  switch (action.type) {
    case FETCH_ADMINS:
      return action.payload.data || false;
    default:
      return state;
  }
};
