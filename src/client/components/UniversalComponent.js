import React, {Component} from 'react';
import universal from 'react-universal-component';

export default class extends Component {
	state = {
		Component: null
	};

	componentWillMount() {
		const { is, onLoad } = this.props;

		const componentName = is.id.toString().replace(/\//, '').replace(/\./g, '');

		const UC = universal(is, {
			onLoad: () => typeof onLoad === 'function'
				&& onLoad(`universal component: ${componentName}, is loaded!`),
		});

		return this.setState({ Component: UC });
	}

	render() {
		const { Component } = this.state;
		const { is, onLoad, ...rest } = this.props;

		return <Component {...rest} />
	}
}