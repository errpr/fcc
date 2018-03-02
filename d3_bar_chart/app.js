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

let minYear = 1947;
let maxYear = 2018;

function increaseMinYear() {
    if(minYear == maxYear - 1) { return; }
    minYear++;
    refilter();
    document.getElementById("min-year-display").innerText = minYear;
}

function decreaseMinYear() {
    minYear--;
    refilter();
    document.getElementById("min-year-display").innerText = minYear;
}

function increaseMaxYear() {
    maxYear++;
    refilter();
    document.getElementById("max-year-display").innerText = maxYear;
}

function decreaseMaxYear() {
    if(maxYear == minYear + 1) { return; }
    maxYear--;
    refilter();
    document.getElementById("max-year-display").innerText = maxYear;
}

function filterDates(data, minDate, maxDate) {
    return data.filter(e => { let d = Date.parse(e[0]); return (d >= minDate && d < maxDate);});
}

function refilter() {
    render(filterDates(globalData.data, Date.parse(minYear + "-01-01"), Date.parse(maxYear + "-01-01")));
}

function render(data) {
    scaleY.domain(d3.extent(data, el => { return el[1]; }));
    scaleX.domain(d3.extent(data, el => { return Date.parse(el[0]); }));

    let barWidth = width / data.length;

    let bar = chart.selectAll(".bar")
                   .data(data)
    
    bar.exit().remove();

    enterBar = bar.enter().append("g")
                .attr("class", "bar");
    enterBar.append("rect")
                .attr("class", "bar-rect");
    enterBar.append("title")
                .attr("class", "bar-title");

    bar.merge(enterBar)
        .selectAll(".bar-rect")
          .attr("x", (d, i) => scaleX(Date.parse(d[0])))
          .attr("y", (d, i) => scaleY(d[1]))
          .attr("height", (d, i) => height - scaleY(d[1]))
          .attr("width", barWidth)
          .attr("fill", (d, i) => d3.hsl(100, 0.5, 0.5));

    bar.merge(enterBar)
        .selectAll(".bar-title")
          .text((d, i) => `Date: ${d[0]}\nGDP: ${d[1]}`);


    let yAxis = d3.axisLeft(scaleY);
    let xAxis = d3.axisBottom(scaleX).ticks(5);

    
    d3.select(".y.axis").call(yAxis);


    d3.select(".x.axis").call(xAxis);
}

d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json", (e, d) => {
    globalData = d;
    
    d3.select("svg")
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", margin.left + 5)
        .attr("x", 1 - margin.top)
        .attr("dy", ".75em")
        .style("text-anchor", "end")
        .text("United States Gross Domestic Product");

    chart.append("g")
        .attr("class", "y axis");

    chart.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0, ${height})`);
    refilter();
});