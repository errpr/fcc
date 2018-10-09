function DrumPad(props) {
	return (
		<div id={"pad-" + props.padKey} 
			className="drum-pad" 
			onclick={props.clickPad}>
			{props.padKey}
			<audio
        		id={props.padKey}
        		src={props.padKey + ".mp3"}>
        		Your browser does not support the <code>audio</code> element.
    		</audio>
		</div>
	);
}
class App extends React.Component {
    render() {
        return(<h1>App</h1>);
    }
}
ReactDOM.render(<App />, document.getElementById('drum-machine'));