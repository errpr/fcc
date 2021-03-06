import React from "react";
import SettingsMenu from "./settingsmenu";

export default class TopBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { value: "", settingsVisible: false };
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.toggleSettings = this.toggleSettings.bind(this);
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

    toggleSettings() {
        this.setState(prevState => ({ settingsVisible: !prevState.settingsVisible }))
    }

    render() {
        return(
            <div className="topBarContainer">
                <div className="topBar">
                    <input 
                        className="streamInput"
                        type="text" 
                        placeholder="Add a stream by name."
                        value={this.state.value} 
                        onKeyDown={this.handleKeyDown} 
                        onChange={this.handleChange} />
                    <button 
                        className={"settingsButton " + (this.state.settingsVisible ? 'toggledBurger' : '')} 
                        onClick={this.toggleSettings}>
                        &#9776;
                    </button>
                </div>
                { this.state.settingsVisible &&
                    <SettingsMenu 
                        useLocalStorage={this.props.useLocalStorage}
                        toggleLocalStorage={this.props.toggleLocalStorage} 
                        refreshStreams={this.props.refreshStreams}
                        toggleRefreshStreams={this.props.toggleRefreshStreams} />
                }
            </div>
        )
    }
}