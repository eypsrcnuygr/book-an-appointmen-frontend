import { combineReducers } from 'redux';
import createUserReducer from './createUserReducer';

const rootReducer = combineReducers({
  createUserReducer,
});

export default rootReducer;
