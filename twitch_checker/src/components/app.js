import React from 'react';
import Logo from './logo';
import TopBar from './topbar';
import StreamList from './streamlist';
import FilterBar from './filterbar';

export default class App extends React.Component {
    render() {
        return(
            <div>
                <Logo />
                <TopBar />
                <StreamList />
                <FilterBar />
            </div>
        )
    }
}