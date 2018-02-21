const MINIMUM_FETCH_TIME = 1000000;

function TableRow(props) {
    return(
        <tr>
            <td>{props.ranking}</td>
            <td className="camper-name-cell">
                <img src={props.camper.img} className="avatarpic" />
                <a href={'https://www.freecodecamp.com/' + props.camper.username}>
                    {props.camper.username}
                </a>
            </td>
            <td>{props.camper.recent}</td>
            <td>{props.camper.alltime}</td>
        </tr>
    );
}

function Table(props) {
    // let pred = function() { return 1 };
    // switch(props.sort) {
    //     case('all'): pred = function(a, b) { return (a.all_points < b.all_points) ? 1 : -1; } ; break;
    //     case('30'): pred = function(a, b) { return (a.month_points < b.month_points) ? 1 : -1; }; break;
    // }
    let tableRows = props
                    .campers
                    .map((e, i) => <TableRow key={i} ranking={i+1} camper={e} />);
    return(
        <table className="main-table">
            <thead>
                <tr>
                    <th>Rank</th>
                    <th>Name</th>
                    <th className={props.sort == '30' ? 'selected' : 'selectable'} 
                        onClick={props.sort_30}>Last 30 Days</th>
                    <th className={props.sort == 'all' ? 'selected' : 'selectable'} 
                        onClick={props.sort_all}>All Time</th>
                </tr>
            </thead>
            <tbody>
                {tableRows}
            </tbody>
        </table>
    );
}

function TopBar(props) {
    return(
        <div id="app-title">
            <h1 id="app-title-text">freeCodeCamp Leaderboards</h1>
        </div>
        );
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sort: 'all',
            last_fetch_time_all: 0,
            last_fetch_time_30: 0,
            campers_30: [{}],
            campers_all: [{
                username: "errpr",
                img: "https://avatars3.githubusercontent.com/u/22058959?v=1",
                alltime: 3,
                recent: 1,
                lastUpdate: "2018-02-20T19:58:50.041Z"
            }],
        };

        this.fetch_top_all = () => {
            if(Date.now() - this.state.last_fetch_time_all > MINIMUM_FETCH_TIME) {
                fetch('https://fcctop100.herokuapp.com/api/fccusers/top/alltime', 
                      { mode: 'cors', headers: { 'accept' : 'application/json' } }).then(response => {
                    if(response.ok) {
                        return(response.json());
                    }
                }).then(json => this.setState({ campers_all: json, last_fetch_time_all: Date.now }))
            }
        }

        this.fetch_top_30 = () => {
            if(Date.now() - this.state.last_fetch_time_30 > MINIMUM_FETCH_TIME) {
                fetch('https://fcctop100.herokuapp.com/api/fccusers/top/recent', 
                      { mode: 'cors', headers: { 'accept' : 'application/json' } }).then(response => {
                    if(response.ok) {
                        return(response.json());
                    }
                }).then(json => this.setState({ campers_30: json, last_fetch_time_30: Date.now }))
            }
        }

        this.sort_all = () => {
            this.fetch_top_all();
            this.setState({ sort: 'all' });
        }

        this.sort_30 = () => {
            this.fetch_top_30();
            this.setState({ sort: '30' });
        }
    }

    componentDidMount() {
        this.fetch_top_all();
        this.fetch_top_30();
    }

    render() {
        return(
            <div id="app">
                <TopBar />
                <Table 
                    campers={this.state.sort == 'all' ? this.state.campers_all : this.state.campers_30}
                    sort_30={this.sort_30}
                    sort_all={this.sort_all}
                    sort={this.state.sort} />
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.getElementById('root')
);