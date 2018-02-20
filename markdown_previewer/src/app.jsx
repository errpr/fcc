class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "# Welcome"
        }

        this.handleChange = (e) => {
            this.setState({
                text: e.target.value
            });
        }
    }

    componentDidMount() {
        this.refs.display.innerHTML = marked(this.state.text);
    }

    componentDidUpdate() {
        this.refs.display.innerHTML = marked(this.state.text);
    }

    render() {
        return(
            <div id="app-container">
                <h3>Markdown Previewer</h3>
                <div id="editor-container">
                    <textarea   name="editing-area" 
                                id="editing-area"
                                className="halves"
                                onChange={this.handleChange}
                                value="# Welcome">
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