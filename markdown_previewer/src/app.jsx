class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: ""
        }

        this.handleChange = (e) => {
            this.setState({
                text: e.target.value
            });
        }
    }

    componentDidUpdate() {
        this.refs.display.innerHTML = marked(this.state.text);
    }

    render() {
        return(
            <div id="app-container">
                <h1>Markdown Previewer</h1>
                <div id="editor-container">
                    <textarea   name="editing-area" 
                                id="editing-area"
                                className="halves"
                                onChange={this.handleChange}>
                    </textarea>
                    <div id="display-area"
                         className="halves"
                         ref="display">
                    </div>
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);