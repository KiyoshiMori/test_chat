import React, {Component} from 'react';
import universal from 'react-universal-component';

export default class extends Component {
	render() {
		const { is, onLoad, ...props } = this.props;

		const componentName = is.id.toString().replace(/\//, '').replace(/\./g, '');

		const UC = universal(() => is, {
			onLoad: () => typeof onLoad === 'function'
				&& onLoad(`universal component: ${componentName}, is loaded!`),
		});

		return <UC {...props} />
	}
}