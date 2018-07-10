import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import thunk from 'redux-thunk';
import { authReducer } from './reducers';

const enchancer = typeof window === 'object' &&
	window.__REDUX_DEVTOOLS_EXTENSION__ &&
	window.__REDUX_DEVTOOLS_EXTENSION__();

const reducers = combineReducers(authReducer);

export default createStore(
	authReducer,
	enchancer,
	applyMiddleware(thunk),
);
