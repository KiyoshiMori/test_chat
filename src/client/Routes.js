import React, { Component } from 'react';
import { Route, Link, Switch, withRouter} from 'react-router-dom';
import _ from 'lodash';
import { connect } from 'react-redux';
import { graphql, withApollo } from 'react-apollo';
import { actionTest } from '../lib/redux/reducers';
import { getMessages, newMessageSibscription, sendMessage } from '../lib/graphql/queries/messages';
// import universal from 'react-universal-component';
// import './test.styl';
import styles from './test.styl';

import UniversalComponent from './Components/UniversalComponent';
const MainPage = import('./Components/MainPage');

@withApollo
@withRouter
@connect()
@graphql(getMessages, {
	options: ownProps => ({
		variables: { receiver: ownProps.receiver, sender: ownProps.sender },
	}),
	name: 'getMessages'
})
export default class extends Component {
	state = {
		inputText: ''
	};

	componentDidMount() {
		const { getMessages, receiver, sender } = this.props;

		getMessages
			.subscribeToMore({
				document: newMessageSibscription,
				variables: { receiver, sender },
				updateQuery: (prev, { subscriptionData }) => {
					const newMessage = subscriptionData.data.newMessage;

					if (!newMessage) return;

					const messages = _.concat(prev.getMessages, [newMessage]);

					return {
						getMessages: messages
					}
				}
			});
	}

	getMessages = () => {
		const { client, receiver, sender } = this.props;
		const { inputText } = this.state;

		client.mutate({
			mutation: sendMessage,
			variables: { text: inputText, sender, receiver }
		})

		this.setState({ inputText: '' });
	};

	inputMessage = e => {
		const { value } = e.target;

		this.setState({ inputText: value });
	};

	render() {
		const { dispatch, getMessages: { getMessages } } = this.props;
		const { inputText } = this.state;

		// console.log(this.props, 'props at roout');

		return (
			<div>
				<div className={styles.Links}>
					<Link to="/">Main page</Link>
					<Link to="/test">Test page</Link>
				</div>
				<input type="text" value={inputText} onChange={e => this.inputMessage(e)}/>
				<button onClick={this.getMessages}>Send!</button>
				{getMessages?.map(el => {
					return <h1>{el.text}</h1>
				})}
				<Switch>
					<Route
						exact path="/"
						render={() =>
							<UniversalComponent
								is={MainPage}
								onLoad={onLoadText => dispatch(actionTest(onLoadText))}
							/>
						}
					/>
					<Route path="/test" render={() => <h1>testtest</h1>} />
				</Switch>
			</div>
		)
	}
}