import React from 'react';

export default function StreamItem(props) {
    let stream = props.stream["stream"];
    if(props.stream.status === 'online'){
        return(
            <li className="streamItem">
                <img src={stream["channel"]["logo"]} className="streamItemLogo" />
                <div className="streamItemBlockContainer">
                    <h3 className="streamItemTitle">
                        <a href={stream["channel"]["url"]} className="streamItemLink">
                            {stream["channel"]["display_name"]}
                        </a>
                    </h3>
                    <p className="streamItemLine">{stream["stream_type"].charAt(0).toUpperCase() + stream["stream_type"].slice(1)} with {stream["viewers"]} viewers</p>
                    <p className="streamItemLine">{stream["channel"]["status"]}</p>
                    <p className="streamItemLine">Playing {stream["channel"]["game"]}</p>
                </div>
                <button 
                    data-stream-name={props.stream.name} 
                    className="streamItemDeleteButton" 
                    onClick={props.deleteStream}>
                    x
                </button>
            </li>
        );
    } else {
        return(
            <li className="streamItem">
                <img src={stream["channel"]["logo"]} className="streamItemLogo" />
                <div className="streamItemBlockContainer">
                    <h3 className="streamItemTitle">
                        <a href={stream["channel"]["url"]} className="streamItemLink">
                            {stream["channel"]["display_name"]}
                        </a>
                    </h3>
                    <p className="streamItemLine">Offline</p>
                    <p className="streamItemLine">Last seen playing {stream["channel"]["game"]}</p>
                </div>
                <button 
                    data-stream-name={props.stream.name} 
                    className="streamItemDeleteButton" 
                    onClick={props.deleteStream}>
                    x
                </button>
            </li>
        );
    }
}