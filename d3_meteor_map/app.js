let globalData;

const margin = { top: 50, right: 50, bottom: 50, left: 50 };

const outerWidth = 800;
const outerHeight = 600;
const circleSize = 32;

const width = outerWidth - margin.left - margin.right;
const height = outerHeight - margin.top - margin.bottom;

let svg = d3.select("#root")
                .append("svg")
                .attr("width", outerWidth)
                .attr("height", outerHeight)
                .call(d3.zoom().on("zoom", () => chart.attr("transform", d3.event.transform) ));
let chart = svg.append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`)
                

let layout = d3.forceSimulation();

let infobox = d3.select("#infobox").style("visibility", "hidden");

function infoboxFormat(data) {
    return `<p>${data["country"]}</p>`;
}

function render(geoData, meteorData) {
    let projection = d3.geoMercator().scale(500).translate([width / 2, height / 2])

    let geoPath = d3.geoPath().projection(projection);
    let map = chart.append("path").datum(geoData)
        .attr("d", geoPath)
        .attr("fill", "#aaa")
        .attr("stroke", "#fff");

    let strikes = chart.selectAll(".meteorPath")
        .data(meteorData.features)
        .enter()
        .append("path")
        .attr("class", "meteorPath")
        .attr("d", geoPath)
        .attr("fill", d3.hsl(120, 0.5, 0.5))
}

d3.json("custom.geo.json", (e, d) => {
    d3.json("meteorite-strike-data.json", (e2, d2) => {
        globalData = d2;
    
        render(d, d2);
    });
});