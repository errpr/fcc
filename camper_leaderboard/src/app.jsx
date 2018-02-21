function TableRow(props) {
    return(
        <tr>
            <td>{props.ranking}</td>
            <td>{props.camper.name}</td>
            <td>{props.camper.month_points}</td>
            <td>{props.camper.all_points}</td>
        </tr>
    );
}

function Table(props) {
    let pred = function() { return 1 };
    switch(props.sort) {
        case('all'): pred = function(a, b) { return (a.all_points < b.all_points) ? 1 : -1; } ; break;
        case('30'): pred = function(a, b) { return (a.month_points < b.month_points) ? 1 : -1; }; break;
    }
    let tableRows = props.campers
                         .sort(pred)
                         .map((e, i) => <TableRow key={e.id} ranking={i+1} camper={e} />);
    return(
        <table>
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
    return(<h1>Top Bar</h1>);
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            campers: [{
                id: 0,
                name: 'Steven B',
                month_points: 1,
                all_points: 3
            },
            {
                id: 1,
                name: 'Kitty H',
                month_points: 2,
                all_points: 2
            }],
            sort: 'all'
        };

        this.sort_all = () => {
            this.setState({ sort: 'all' });
        }
        this.sort_30 = () => {
            this.setState({ sort: '30' });
        }
    }
    render() {
        return(
            <div id="app">
                <TopBar />
                <Table 
                    campers={this.state.campers}
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