let debugvar;

async function main() {
    let req;
    let data;

    try {
        req = await fetch("GDP-data.json");
        data = await req.json()
    } catch {
        req = await fetch("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json");
        data = await req.json();
    }

    debugvar = data;
    let gdpData = data.data;
    let filteredData = filterDates(gdpData, Date.parse("1990-01-01"), Date.parse("2019-01-01"));
    console.log(filteredData);
    doD3Stuff(filteredData);
}

function filterDates(data, minDate, maxDate) {
    return data.filter(e => { let d = Date.parse(e[0]); return (d >= minDate && d < maxDate);});
}

function doD3Stuff(data) {
    let dataValues = data.map(e => e[1]);
    let rc = createRangeConverter(dataValues, 0, 100);

    let scale = d3.scaleLinear()
        .domain([dataValues.reduce((a, b) => { return Math.min(a, b); }), dataValues.reduce((a, b) => { return Math.max(a, b); })])
        .range([0, 100]);

    console.log(scale(900));

    let root = d3.select("#root")
    root.selectAll("div")
        .data(data)
        .enter()
            .append("div")
            .style("height", function(d, i) { return scale(d[1]) + "%"; });
}

main();