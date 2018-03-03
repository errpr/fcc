let globalData;

const margin = { top: 20, right: 200, bottom: 50, left: 100 };

const outerWidth = 1024;
const outerHeight = 600;

const height = (outerHeight - margin.top) - margin.bottom;
const width = outerWidth - margin.left - margin.right;

let barHeight = height / 11;

let scaleY = d3.scaleTime().range([0, height - barHeight]);
let scaleX = d3.scaleTime().range([0, width]);

let chart = d3.select("#root")
                .append("svg")
                .attr("width", outerWidth)
                .attr("height", outerHeight)
                .append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);

let infobox = d3.select("#infobox").style("visibility", "hidden");

function infoboxFormat(data, baseTemp) {
    return `<p>Date: ${d3.timeFormat("%B")(new Date(2018, data["month"]))} ${data["year"]}</p>
            <p>Variance: ${data["variance"]}</p>
            <p>Temp: ${baseTemp + data["variance"]}&deg;C`;
}

function render(data) {
    let baseTemp = data["baseTemperature"];
    data = data["monthlyVariance"];
    
    yExtent = d3.extent(data, el => new Date(2018, el["month"] - 1));
    xExtent = d3.extent(data, el => new Date(el["year"], 1));

    scaleY.domain(yExtent);
    scaleX.domain(xExtent);

    let barWidth = width / (data.length / 12);

    let bar = chart.selectAll(".bar")
                   .data(data)
    
    bar.exit().remove();

    let enterBar = bar.enter().append("rect")
                .attr("class", "bar")
                .attr("height", barHeight)
                .attr("width", barWidth)

    lightScale = d3.scaleLinear().range([1, 0]).domain(d3.extent(data, d => Math.abs(d["variance"])));

    bar.merge(enterBar)
        .attr("transform", (d, i) => `translate(${scaleX(new Date(d["year"], 1))}, ${scaleY(new Date(2018, d["month"] - 1))})`)
        .attr("fill", (d) => { return d3.hsl((d["variance"] > 0 ? 20 : 200), 0.5, lightScale(Math.abs(d["variance"])) - 0.1) } )
        .on("mouseover", (d) => { infobox.style("visibility", "visible").html(infoboxFormat(d, baseTemp)); })
        .on("mousemove", (d) => { infobox.style("left", (d3.event.pageX + 10) + "px").style("top", (d3.event.pageY + 20) + "px"); })

    let yAxis = d3.axisLeft(scaleY).ticks(d3.timeMonth).tickFormat(d3.timeFormat("%B"));
    let xAxis = d3.axisBottom(scaleX);

    d3.select(".y.axis").call(yAxis);
    d3.select(".x.axis").call(xAxis);
}

d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json", (e, d) => {
    globalData = d;
    
    d3.select("svg")
        .append("text")
        .attr("transform", `rotate(-90) translate(${1 - (height / 2) + margin.top}, 0)`)
        .attr("dy", ".75em")
        .style("text-anchor", "end")
        .style("font-weight", "bold")
        .style("font-size", "150%")
        .text("Months");

    d3.select("svg")
        .append("text")
        .attr("y", height + margin.top + (margin.bottom * 0.5))
        .attr("x", (width / 2) + margin.left) 
        .attr("dy", ".75em")
        .style("text-anchor", "end")
        .style("font-weight", "bold")
        .style("font-size", "150%")
        .text("Years");

    chart.append("g")
        .attr("class", "y axis")
        .attr("transform", `translate(0,${barHeight / 2})`);

    chart.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${height})`);
    render(d);
});