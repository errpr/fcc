import React from "react";

export default class FilterBar extends React.Component {
    render() {
        return(
            <div>
                <button onClick={() => this.props.changeFilter("all")}>All</button>
                <button onClick={() => this.props.changeFilter("online")}>Online</button>
                <button onClick={() => this.props.changeFilter("offline")}>Offline</button>
            </div>
        )
    }
}