import React from "react";
import StreamItem from './streamitem';

export default function StreamList(props) {
    const sortStreams = (a, b) => {
        if(a.status === 'online') {
            if(b.status === 'offline') {
                return -1;
            } else {
                if(a.name < b.name) {
                    return -1;
                } else {
                    return 1;
                }
            }
        } else {
            if(b.status === 'online') {
                return 1;
            } else {
                if(a.name < b.name) {
                    return -1;
                } else {
                    return 1;
                }
            }
        }
    }
    return(
        <ul className="streamList">
            {
                props.streams.sort(sortStreams).map(stream => {
                    return <StreamItem key={stream.name} stream={stream} deleteStream={props.deleteStream} />
                })
            }
        </ul>
    );
}