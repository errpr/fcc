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

    doD3Stuff(data);
}

function doD3Stuff(data) {
    let rc = createRangeConverter(data.data.map(e => e[1]), 0, 100);
    d3.select("#root")
        .selectAll("div")
        .data(data.data)
        .enter()
            .append("div")
            .style("height", function(d, i) { return rc(d[1]) + "%"; })
}

function createRangeConverter(data, newMin, newMax) {
    let max = data.reduce((a, b) => { return Math.max(a, b); });
    let min = data.reduce((a, b) => { return Math.min(a, b); });
    let range = max - min;
    let newRange = newMax - newMin
    return function(d) {
        return (((d - min) * newMax) / range) + newMin;
    }
}

main();