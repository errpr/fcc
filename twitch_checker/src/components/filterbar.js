import React from "react";

export default function FilterBar(props) {
    return(
        <div className="filterBar">
            <button data-filter-name="all" onClick={props.changeFilter}>All</button>
            <button data-filter-name="online" onClick={props.changeFilter}>Online</button>
            <button data-filter-name="offline" onClick={props.changeFilter}>Offline</button>
        </div>
    )
}