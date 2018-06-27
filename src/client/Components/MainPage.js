import React, {Component, Fragment} from 'react';
import { graphql, withApollo } from 'react-apollo';
import _ from 'lodash';
import { getMessages, newMessageSibscription, sendMessage, isTyping, isTypingSubscription } from '../../lib/graphql/queries/messages';
import { getMyInfo } from '../../lib/graphql/queries/user';

@withApollo
@graphql(getMyInfo, {
	props: ({ data }) => {
		if (data.loading === true) {
			return { loading: data.loading }
		} else {
			const {authorized, ...info} = data?.getMyInfo;
			return {
				myInfo: {...info},
				authorized
			}
		}
	}
})
@graphql(getMessages, {
	options: ownProps => ({
		variables: { receiver: ownProps.receiver, sender: ownProps.sender },
	}),
	name: 'getMessages'
})
export default class extends Component {
	state = {
		inputText1: '',
		inputText2: '',
		isTyping: false,
	};

	async componentDidMount() {
		const { getMessages, receiver, sender } = this.props;

		getMessages
			.subscribeToMore({
				document: newMessageSibscription,
				variables: { receiver, sender },
				updateQuery: (prev, { subscriptionData }) => {
					const { newMessage } = subscriptionData?.data;

					if (!newMessage) return;

					console.log({ newMessage });

					const messages = _.concat(prev.getMessages, [newMessage]);

					return {
						getMessages: messages
					}
				}
			});

		getMessages
			.subscribeToMore({
				document: isTypingSubscription,
				variables: { from: 21, to: 13 },
				updateQuery: (prev, { subscriptionData }) => {
					const { isTypingSubscription: { isTyping } } = subscriptionData?.data;

					this.setState({ isTyping  });
				}
			});
	}

	postMessage = ({ sender, receiver, name }) => {
		const { client } = this.props;

		client.mutate({
			mutation: sendMessage,
			variables: { text: this.state[name], sender, receiver }
		});

		this.setState({ [name]: '' });
	};

	inputMessage = e => {
		const { value, name } = e.target;
		this.isTypingFunc(true);

		this.setState({ [name]: value });
	};

	isTypingFunc = isTypingBool => {
		const { client, sender, receiver } = this.props;

		if ((this.state.isTyping === true) && (isTypingBool === true)) return;

		return client.mutate({
			mutation: isTyping,
			variables: { sender, receiver, isTyping: isTypingBool },
		});
	};

	onBlur = () => {
		this.isTypingFunc(false);
	};

	render() {
		const { inputText1, inputText2, isTyping } = this.state;
		const { getMessages: { getMessages }, sender, receiver } = this.props;

		const messages = getMessages?.slice().reverse();

		console.log('props', this.props);
		return (
			<Fragment>
				<div style={{ float: 'left' }}>
					<input
						type="text"
						name="inputText1"
						value={inputText1}
						onChange={e => this.inputMessage(e)}
						onBlur={this.onBlur}
						onKeyPress={e => {
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
				{isTyping && <h2>user1 is typing...</h2>}
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