import React, { Component } from 'react';
import { Route, Link, Switch } from 'react-router-dom';
// import universal from 'react-universal-component';

import UniversalComponent from './Components/UniversalComponent';
const MainPage = import('./Components/MainPage');

export default class extends Component {
	render() {
		return (
			<div>
				<div>
					<Link to="/">Main page</Link>
					<Link to="/test">Test page</Link>
				</div>
				<Switch>
					<Route
						exact path="/"
						render={() =>
							<UniversalComponent is={MainPage} />
						}
					/>
					<Route path="/test" render={() => <h1>testtest</h1>} />
				</Switch>
			</div>
		)
	}
}