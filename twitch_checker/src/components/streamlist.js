import React from "react";
import StreamItem from './streamitem';

export default class StreamList extends React.Component {
    render() {
        return(
            <ul className="streamList">
                {
                    this.props.streams.map(stream => {
                        return <StreamItem key={stream.name} stream={stream} />
                    })
                }
            </ul>
        );
    }
}