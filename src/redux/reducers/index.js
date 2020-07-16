import { combineReducers } from 'redux';
import { reducer as toastrReducer } from 'react-redux-toastr';
import userReducer from './userReducer';
import meetReducer from './meetReducer';
export default combineReducers({
	toastr: toastrReducer,
	auth: userReducer,
	meeting: meetReducer,
});
