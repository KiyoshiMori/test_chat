import { createStore } from 'redux';
import { testReducer } from './reducers';

const enchancer = typeof window === 'object' &&
	window.__REDUX_DEVTOOLS_EXTENSION__ &&
	window.__REDUX_DEVTOOLS_EXTENSION__();

export default createStore(testReducer, enchancer);
