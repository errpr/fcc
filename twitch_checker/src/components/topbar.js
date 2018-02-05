import React from "react";

export default class TopBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: "" };
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleClick(e) {
        this.props.addStream(this.state.value);
        this.setState({ value: "" });
    }

    handleChange(e) {
        if(e.key === "Enter"){
            e.preventDefault();
            this.props.addStream(this.state.value);
            this.setState({ value: "" });
        } else {
            this.setState({ value: e.target.value });
        }
    }

    render() {
        return(
            <div>
                <input type="text" placeholder="Stream Name" value={this.state.value} onChange={this.handleChange} />
                <button onClick={this.handleClick}>Add Stream</button>
            </div>
        )
    }
}