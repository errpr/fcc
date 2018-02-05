import React from "react";
import StreamItem from './streamitem';

export default class StreamList extends React.Component {
    render() {
        return(
            <ul>
                {
                    this.props.streams.map(stream => {
                        return <StreamItem key={stream.name} stream={stream} />
                    })
                }
            </ul>
        );
    }
}