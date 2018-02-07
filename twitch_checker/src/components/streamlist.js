import React from "react";
import StreamItem from './streamitem';

export default function StreamList(props) {
    return(
        <ul className="streamList">
            {
                props.streams.map(stream => {
                    return <StreamItem key={stream.name} stream={stream} deleteStream={props.deleteStream} />
                })
            }
        </ul>
    );
}