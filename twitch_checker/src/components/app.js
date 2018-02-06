import React from 'react';
import Logo from './logo';
import TopBar from './topbar';
import StreamList from './streamlist';
import FilterBar from './filterbar';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            streams: [
                { name: 'freeCodeCamp', status: 'online' },
                { name: 'dansgaming', status: 'offline' }
            ],
            filter: "all"
        };
        this.addStream = this.addStream.bind(this);
        this.changeFilter = this.changeFilter.bind(this);
    }

    addStream(name) {
        if(this.state.streams.filter(stream => stream.name == name).length == 0){
            this.setState(prevState => (
                { streams: [ ...prevState.streams, { name: name }]}
            ))
        }
    }

    changeFilter(newFilter) {
        this.setState({ filter: newFilter });
    }

    visibleStreams() {
        switch(this.state.filter) {
            case "all": return this.state.streams;
            case "online": return this.state.streams.filter(s => s.status === 'online');
            case "offline": return this.state.streams.filter(s => s.status === 'offline');
            default: return this.state.streams;
        }
    }

    render() {
        return(
            <div>
                <Logo />
                <TopBar addStream={this.addStream} />
                <StreamList streams={this.visibleStreams()} />
                <FilterBar changeFilter={this.changeFilter} />
            </div>
        )
    }
}