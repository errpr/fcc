const AUDIO_HOST_URL = "http://error.diodeware.com/fcc/drum_machine/audio/";
const PAD_KEYS = ['Q', 'W', 'E', 'A', 'S', 'D', 'Z', 'X', 'C'];

function DrumPad(props) {
	return (
		<div id={"pad-" + props.padKey} 
			className="drum-pad" 
			onClick={props.onClick}>
			{props.padKey}
			<audio
        		id={props.padKey}
        		src={AUDIO_HOST_URL + props.padKey + ".wav"}
				preload="auto"
				className="clip"
				loop={false}>
        		Your browser does not support the <code>audio</code> element.
    		</audio>
		</div>
	);
}

function DrumPadGrid(props) {
	const drumPads = PAD_KEYS.map(e => {
		return <DrumPad key={"pad-" + e} padKey={e} onClick={props.createClickHandler(e)} />;
	});

	return (
		<div id="drum-pad-grid">
			{ drumPads }
		</div>
	);
}

function DrumDisplay(props) {
	return(
		<div id="display">
			{props.text}
		</div>
	);
}

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			currentButton: "\u0000"
		}

		this.playSample = (key) => {
			this.setState({ currentButton: key });
			let audioElement = document.getElementById(key);
			audioElement.pause();
			audioElement.currentTime = 0;
			audioElement.play();
		}

		this.handleKeys = (event) => {
			const k = event.key.toUpperCase();
			if (k && PAD_KEYS.includes(k)) {
				this.playSample(k);
			}
		}

		this.createClickHandler = (keyCode) => {
			const root = this;
			return function() {
				root.playSample(keyCode);
			}
		}
	}

	componentDidMount() {
		window.addEventListener("keydown", this.handleKeys);
	}

	componentWillUnmount() {
		window.removeEventListener("keydown", this.handleKeys);
	}

    render() {
        return(
			<div id="drum-machine">
				<DrumDisplay text={this.state.currentButton} />
				<DrumPadGrid createClickHandler={this.createClickHandler} />
			</div>
		);
    }
}
ReactDOM.render(<App />, document.getElementById('root'));