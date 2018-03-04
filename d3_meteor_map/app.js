let globalData;

const margin = { top: 50, right: 50, bottom: 50, left: 50 };

const outerWidth = 800;
const outerHeight = 600;
const circleSize = 32;

const width = outerWidth - margin.left - margin.right;
const height = outerHeight - margin.top - margin.bottom;

let chart = d3.select("#root")
                .append("svg")
                .attr("width", outerWidth)
                .attr("height", outerHeight)
                .append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);

let layout = d3.forceSimulation();

let infobox = d3.select("#infobox").style("visibility", "hidden");

function infoboxFormat(data) {
    return `<p>${data["country"]}</p>`;
}

function render(data) {
    let projection = d3.geoMercator().scale(300)

    let geoPath = d3.geoPath().projection(projection);
    chart.append("path").datum(data)
        .attr("d", geoPath);

}

d3.json("custom.geo.json", (e, d) => {
    globalData = d;
    
    render(d);
});