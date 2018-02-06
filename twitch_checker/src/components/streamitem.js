import React from 'react';

export default class StreamItem extends React.Component {
    render() {
        let stream = this.props.stream["stream"];
        if(this.props.stream.status === 'online'){
            return(
                <li className="streamItem">
                    <img src={stream["channel"]["logo"]} className="streamItemLogo" />
                    <h3 className="streamItemTitle">
                        <a href={stream["channel"]["url"]} className="streamItemLink">
                            {stream["channel"]["display_name"]}
                        </a>
                    </h3>
                    <p className="streamItemLine">{stream["stream_type"].charAt(0).toUpperCase() + stream["stream_type"].slice(1)} with {stream["viewers"]} viewers</p>
                    <p className="streamItemLine">{stream["channel"]["status"]}</p>
                    <p className="streamItemLine">Playing {stream["channel"]["game"]}</p>
                </li>
            );
        } else {
            return(
                <li className="streamItem">
                    <img src={stream["channel"]["logo"]} className="streamItemLogo" />
                    <h3 className="streamItemTitle">
                        <a href={stream["channel"]["url"]} className="streamItemLink">
                            {stream["channel"]["display_name"]}
                        </a>
                    </h3>
                    <p className="streamItemLine">Offline</p>
                    <p className="streamItemLine">Last seen playing {stream["channel"]["game"]}</p>
                </li>
            );
        }
    }
}