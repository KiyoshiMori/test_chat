import React, {Component, Fragment} from 'react';
import { graphql, withApollo } from 'react-apollo';
import _ from 'lodash';
import { getMessages, newMessageSibscription, sendMessage } from '../../lib/graphql/queries/messages';

@withApollo
@graphql(getMessages, {
	options: ownProps => ({
		variables: { receiver: ownProps.receiver, sender: ownProps.sender },
	}),
	name: 'getMessages'
})
export default class extends Component {
	state = {
		inputText1: '',
		inputText2: ''
	};

	async componentDidMount() {
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

	postMessage = ({ sender, receiver, name }) => {
		const { client } = this.props;

		console.log(this.state[name], this.state, name);

		client.mutate({
			mutation: sendMessage,
			variables: { text: this.state[name], sender, receiver }
		});

		this.setState({ [name]: '' });
	};

	inputMessage = e => {
		const { value, name } = e.target;

		this.setState({ [name]: value });
	};

	render() {
		const { inputText1, inputText2 } = this.state;
		const { getMessages: { getMessages }, sender, receiver } = this.props;

		const messages = getMessages?.slice().reverse();

		return (
			<Fragment>
				<div style={{ float: 'left' }}>
					<input
						type="text"
						name="inputText1"
						value={inputText1}
						onChange={e => this.inputMessage(e)}
						onKeyPress={e => {
							console.log(e, e.key);
							e.key === 'Enter' && this.postMessage({ sender, receiver, name: 'inputText1' })
						}}
					/>
					<button
						onClick={() => this.postMessage({ sender, receiver, name: 'inputText1' })}
					>
						Send!
					</button>
				</div>
				<div style={{ float: 'right' }}>
					<input
						type="text"
						name="inputText2"
						value={inputText2}
						onChange={e => this.inputMessage(e)}
						onKeyPress={e => {
							console.log(e, e.key);
							e.key === 'Enter' && this.postMessage({ sender: receiver, receiver: sender, name: 'inputText2' })
						}}
					/>
					<button
						onClick={() => this.postMessage({ sender: receiver, receiver: sender, name: 'inputText2' })}
					>
						Send!
					</button>
				</div>
				<div style={{ display: 'flex', flexDirection: 'column'}}>
				{messages?.map(el => {
					return (
						<h1
							key={el.time}
							style={sender === el.messagefrom
								? { backgroundColor:  'green', alignSelf: 'flex-start'}
								: { backgroundColor: 'red', alignSelf: 'flex-end'}
							}
						>
							{el.text}
						</h1>
					)
				})}
				</div>
			</Fragment>
		);
	}
}