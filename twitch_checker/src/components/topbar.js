import React from "react";

export default class TopBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: "" };
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    handleChange(e) {
        this.setState({ value: e.target.value });
    }

    handleKeyDown(e) {
        if(e.key === "Enter"){
            e.preventDefault();
            this.props.addStream(this.state.value);
            this.setState({ value: "" });
        }
    }

    render() {
        return(
            <div>
                <input type="text" placeholder="Stream Name" value={this.state.value} onKeyDown={this.handleKeyDown} onChange={this.handleChange} />
                <button onClick={this.props.toggleSettings}>Settings</button>
            </div>
        )
    }
}