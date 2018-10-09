'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AUDIO_HOST_URL = "http://error.diodeware.com/fcc/drum_machine/audio/";
var PAD_KEYS = ['Q', 'W', 'E', 'A', 'S', 'D', 'Z', 'X', 'C'];

function DrumPad(props) {
	return React.createElement(
		'div',
		{ id: "pad-" + props.padKey,
			className: 'drum-pad',
			onClick: props.onClick },
		props.padKey,
		React.createElement(
			'audio',
			{
				id: props.padKey,
				src: AUDIO_HOST_URL + props.padKey + ".wav",
				preload: 'auto',
				className: 'clip',
				loop: false },
			'Your browser does not support the ',
			React.createElement(
				'code',
				null,
				'audio'
			),
			' element.'
		)
	);
}

function DrumPadGrid(props) {
	var drumPads = PAD_KEYS.map(function (e) {
		return React.createElement(DrumPad, { key: "pad-" + e, padKey: e, onClick: props.createClickHandler(e) });
	});

	return React.createElement(
		'div',
		{ id: 'drum-pad-grid' },
		drumPads
	);
}

function DrumDisplay(props) {
	return React.createElement(
		'div',
		{ id: 'display' },
		props.text
	);
}

var App = function (_React$Component) {
	_inherits(App, _React$Component);

	function App(props) {
		_classCallCheck(this, App);

		var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

		_this.state = {
			currentButton: '\0'
		};

		_this.playSample = function (key) {
			_this.setState({ currentButton: key });
			var audioElement = document.getElementById(key);
			audioElement.pause();
			audioElement.currentTime = 0;
			audioElement.play();
		};

		_this.handleKeys = function (event) {
			var k = event.key.toUpperCase();
			if (k && PAD_KEYS.includes(k)) {
				_this.playSample(k);
			}
		};

		_this.createClickHandler = function (keyCode) {
			var root = _this;
			return function () {
				root.playSample(keyCode);
			};
		};
		return _this;
	}

	_createClass(App, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			window.addEventListener("keydown", this.handleKeys);
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			window.removeEventListener("keydown", this.handleKeys);
		}
	}, {
		key: 'render',
		value: function render() {
			return React.createElement(
				'div',
				{ id: 'drum-machine' },
				React.createElement(DrumDisplay, { text: this.state.currentButton }),
				React.createElement(DrumPadGrid, { createClickHandler: this.createClickHandler })
			);
		}
	}]);

	return App;
}(React.Component);

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));