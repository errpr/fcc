import React from 'react';

export default class StreamItem extends React.Component {
    render() {
        return(<li>{this.props.stream.name}</li>)
    }
}