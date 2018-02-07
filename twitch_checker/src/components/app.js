import React from 'react';
import Logo from './logo';
import TopBar from './topbar';
import StreamList from './streamlist';
import FilterBar from './filterbar';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            streams: [],
            filter: "all"
        };
        this.addStream = this.addStream.bind(this);
        this.changeFilter = this.changeFilter.bind(this);
        this.collectStreams = this.collectStreams.bind(this);
        this.streamDataCallback = this.streamDataCallback.bind(this);
        this.getStream = this.getStream.bind(this);
        this.deleteStream = this.deleteStream.bind(this);
    }

    componentDidMount() {
        if(localStorage.getItem('streams')) {
            this.setState({ streams: JSON.parse(localStorage.getItem('streams'))})
        } else {
            this.setState({ streams: [
                this.blankStream('freeCodeCamp'),
                this.blankStream('dansgaming')
            ]});
        }
        if(localStorage.getItem('filter')) {
            this.setState({ filter: localStorage.getItem('filter')})
        }
    }

    componentDidUpdate() {
        localStorage.setItem('filter', this.state.filter);
        localStorage.setItem('streams', JSON.stringify(this.state.streams));
    }

    collectStreams() {
        this.state.streams.forEach(e => this.getStream(e.name, this.streamDataCallback));
    }

    streamDataCallback(stream) {
        stream.name = stream._links.self.match('\/([^/]+$)')[1];
        if(stream["stream"] == null){
            stream = this.state.streams.find(e => e.name === stream.name)
            stream.status = 'offline';
        } else {
            stream.status = 'online';
        }
        this.setState(prevState => ({
            streams: [ 
                ...prevState.streams.filter(e => e.name != stream.name),
                stream 
            ]
        }));
    }

    getStream(streamId, callback) {
        const apiBaseUrl = "https://wind-bow.glitch.me/twitch-api";
        const callbackName = "jsonp_callback_" + Math.round(100000 * Math.random());
        
        const script = document.createElement('script');
        const e = document.getElementById('jsonp');
        
        window[callbackName] = function(data) {
            delete window[callbackName];
            e.removeChild(script);
            callback(data);
        };

        const url = `${apiBaseUrl}/streams/${streamId}?callback=${callbackName}`;
        
        script.type = 'text/javascript';
        script.src = url;
        
        e.appendChild(script);
    }

    blankStream(name) {
        return {
            name: name,
            status: 'unchecked',
            "stream": {
                "channel": {
                    "game": "Unknown",
                    "display_name": name,
                    "logo": "batman-profile.jpg",
                    "url": "https://www.twitch.tv/" + name
                }
            }
        }
    }

    addStream(name) {
        if(this.state.streams.filter(stream => stream.name == name).length == 0){
            this.setState(prevState => (
                { streams: [ ...prevState.streams, this.blankStream(name)]}
            ));
        }
    }

    deleteStream(e) {
        const streamName = e.target.dataset["streamName"];
        this.setState(prevState => (
            { streams: [ ...prevState.streams.filter(el => el.name !== streamName)]}
        ));
    }

    changeFilter(e) {
        const newFilter = e.target.dataset["filterName"];
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
                <button onClick={this.collectStreams}>Check Streams</button>
                <Logo />
                <TopBar addStream={this.addStream} />
                <StreamList streams={this.visibleStreams()} deleteStream={this.deleteStream} />
                <FilterBar changeFilter={this.changeFilter} />
            </div>
        )
    }
}