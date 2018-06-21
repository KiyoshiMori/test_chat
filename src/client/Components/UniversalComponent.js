import React, {Component} from 'react';
import universal from 'react-universal-component';

export default class extends Component {
	render() {
		const { is } = this.props;

		const UC = universal(props => is);

		return <UC is={is}/>
	}
}