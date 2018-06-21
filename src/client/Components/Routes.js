import React, { Component } from 'react';
import { Route, Link, Switch } from 'react-router-dom';

export default class extends Component {
	render() {
		return (
			<div>
				<div>
					<Link to="/">Main page</Link>
					<Link to="/test">Test page</Link>
				</div>
				<Switch>
					<Route exact path="/" render={() => <h1>Test1234</h1>} />
					<Route path="/test" render={() => <h1>testtest</h1>} />
				</Switch>
			</div>
		)
	}
}