import gql from 'graphql-tag';

export const newMessageSibscription = gql`
	subscription($receiver: Int, $sender: Int) {
		newMessage(input: {receiver: $receiver, sender: $sender}) {
			text
			time
			date
			messagefrom
			messageto
			is_readed
		}
	}
`;

export const getMessages = gql`
	query($receiver: Int, $sender: Int) {
		getMessages(input: {receiver: $receiver, sender: $sender}) {
			text
			time
			date
			messagefrom
			messageto
			is_readed
		}
	}
`;

export const sendMessage = gql`
	mutation($text: String, $receiver: Int, $sender: Int) {
		sendMessage(input: {text: $text, receiver: $receiver, sender: $sender}) {
			status
			code
		}
	}
`;

export const isTyping = gql`
	mutation($isTyping: Boolean, $receiver: Int, $sender: Int) {
		isTyping(input: {isTyping: $isTyping, receiver: $receiver, sender: $sender}) {
			isTyping
		}
	}
`;

export const isTypingSubscription = gql`
	subscription($from: Int, $to: Int) {
		isTypingSubscription(input: {from: $from, to: $to}) {
			isTyping
			receiver
			sender
		}
	}
`;