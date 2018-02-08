import React from "react";

export default function FilterBar(props) {

    const filterButtonBuilder = (name) => {
        return(
            <button 
                className={"filterItem" + (props.selectedFilter === name ? " toggledButton" : "") }
                data-filter-name={name} 
                onClick={props.changeFilter}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
            </button>
        )
    }

    return(
        <div className="filterBar">
            {filterButtonBuilder("all")}
            {filterButtonBuilder("online")}
            {filterButtonBuilder("offline")}
        </div>
    )
}