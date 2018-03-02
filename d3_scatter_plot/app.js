let globalData;

const margin = { top: 20, right: 20, bottom: 50, left: 50 };

const outerWidth = 800;
const outerHeight = 600;

const width = outerWidth - margin.left - margin.right;
const height = outerHeight - margin.top - margin.bottom;

let scaleY = d3.scaleLinear().range([height, 0]);
let scaleX = d3.scaleTime().range([0, width]);

let chart = d3.select("#root")
                .append("svg")
                .attr("width", outerWidth)
                .attr("height", outerHeight)
                .append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);

function render(data) {
    let firstPlaceSeconds = data.find(e => e["Place"] === 1)["Seconds"];
    let circleSize = 5;

    scaleY.domain(d3.extent(data, el => { return el["Place"]; }));
    scaleX.domain(d3.extent(data, el => { return el["Seconds"] - firstPlaceSeconds; }));

    let point = chart.selectAll(".point")
                   .data(data)
    
    point.exit().remove();

    let enterPoint = point.enter().append("g")
                .attr("class", "point");
    enterPoint.append("circle")
                .attr("class", "point-circle");
    enterPoint.append("text")
                .attr("class", "point-name");

    let infobox = enterPoint.append("div")
                            .attr("class", "point-info-container");
    infobox.append("p")
            .attr("class", "point-info-name");
    infobox.append("p")
            .attr("class", "point-info-place");
    infobox.append("p")
            .attr("class", "point-info-time");
    infobox.append("p")
            .attr("class", "point-info-year");
    infobox.append("p")
            .attr("class", "point-info-nationality");
    infobox.append("a")
            .attr("class", "point-info-allegations-link");

    point.merge(enterPoint)
        .attr("transform", (d, i) => `translate(${scaleX(d["Seconds"] - firstPlaceSeconds)}, ${scaleY(d["Place"])})`);

    point.merge(enterPoint)
        .selectAll(".point-circle")
          .attr("r", circleSize)
          .attr("fill", (d, i) => d3.hsl(100, 0.5, 0.5));

    point.merge(enterPoint)
        .selectAll(".point-name")
          .text((d, i) => d["Name"]);


    let yAxis = d3.axisLeft(scaleY);
    let xAxis = d3.axisBottom(scaleX).ticks(5);

    
    d3.select(".y.axis").call(yAxis);


    d3.select(".x.axis").call(xAxis);
}

d3.json("cyclists-data.json", (e, d) => {
    globalData = d;
    
    d3.select("svg")
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", margin.left + 5)
        .attr("x", 1 - margin.top)
        .attr("dy", ".75em")
        .style("text-anchor", "end")
        .text("Ranking");

    d3.select("svg")
        .append("text")
        .attr("y", height - 5)
        .attr("x", width - 5)
        .attr("dy", ".75em")
        .style("text-anchor", "end")
        .text("Minutes Behind Leader");

    chart.append("g")
        .attr("class", "y axis");

    chart.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${height})`);
    render(d);
});