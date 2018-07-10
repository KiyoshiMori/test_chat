export default `
	body {
		margin: 0;
		padding: 0;
		font-family: 'Gaegu', 'Pangolin', cursive !important;
		overflow-x: hidden;
	},
	h2 {
		font-size: 24px;
	}
	
	.fade-enter {
		transform: translateX(-10%);
		transition: transform 1000ms ease-in-out;
	}
	
	.fade-enter-active {
		opacity: 1;
		transform: translateX(0%);
		transition: transform 1000ms ease-in-out;
	}
	
	.fade-exit {
		opacity: 0;
	}
	.fade-exit-active {
		opacity: 0;
	}
	
	.slide-enter {
	  opacity: 0;
	  z-index: 1;
	}
	.slide-enter-active {
	  opacity: 1;
	  transition: opacity 250ms ease-in;
	}
	.slide-exit {
	  opacity: 1;
	}
	.slide-exit-active {
		opacity: 0.3;
		transform: translateX(100%);
		transition: transform 500ms ease-in-out, opacity 500ms ease-in-out;
	}
`;