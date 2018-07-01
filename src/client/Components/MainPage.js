import React, {Component, Fragment} from 'react';
import { graphql, withApollo } from 'react-apollo';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
	getMessages, newMessageSibscription, sendMessage, isTyping, isTypingSubscription
} from '../../lib/graphql/queries/messages';
import { getMyInfo, signup, login } from '../../lib/graphql/queries/user';
import { testReducer } from "../../lib/redux/reducers";
import { Row, Col } from './Grid';

@connect(testReducer)
@withApollo
@graphql(getMessages, {
	options: ownProps => ({
		skip: ownProps.user_id == null,
		variables: { receiver: ownProps.user_id, sender: ownProps.sender },
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
		if (this.props.user_id) {
			this.subscribe();
		}
	}

	async componentDidUpdate(prevProps, prevState) {
		if ((prevProps.user_id == null) && (this.props.user_id != null)) {
			this.subscribe();
		}
	}


	subscribe = async () => {
		const { getMessages, user_id: receiver, sender } = this.props;
		await getMessages.refetch({ receiver, sender });
		console.log(getMessages);
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
				variables: { from: sender, to: receiver },
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
		const { client, sender, user_id: receiver } = this.props;

		if ((this.state.isTyping === true) && (isTypingBool === true)) return;

		return client.mutate({
			mutation: isTyping,
			variables: { sender, receiver, isTyping: isTypingBool },
		});
	};

	onBlur = () => {
		this.isTypingFunc(false);
	};

	sign = async type => {
		const { client } = this.props;
		await client.mutate({
			mutation: type === 'login' ? login : signup,
			variables: { username: 'tester39', password: '123456qwer' },
			refetchQueries: [{
				query: getMyInfo
			}]
		});
	};

	render() {
		const { inputText1, inputText2, isTyping } = this.state;
		const { getMessages: { getMessages }, sender,
			user_id: receiver, authorized, loading
		} = this.props;

		const messages = getMessages?.slice().reverse();

		if (loading) {
			return <div>Loading...</div>
		}

		if (!authorized) return (
			<Fragment>
				<Row>
					<Col sizeMd={6}>test</Col>
					<button onClick={() => this.sign('signup')}>Signup</button>
					<button onClick={() => this.sign('login')}>Login</button>
					<div>You are not logined!</div>
				</Row>
			</Fragment>
		);
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
						style={{ backgroundColor: authorized ? 'green' : 'red' }}
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