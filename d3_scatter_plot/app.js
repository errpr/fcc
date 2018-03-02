let globalData;

const margin = { top: 20, right: 200, bottom: 50, left: 50 };

const outerWidth = 800;
const outerHeight = 600;
const circleSize = 8;

const width = outerWidth - margin.left - margin.right;
const height = outerHeight - margin.top - margin.bottom;

let scaleY = d3.scaleLinear().range([0, height]);
let scaleX = d3.scaleTime().range([width, 0]);
let chart = d3.select("#root")
                .append("svg")
                .attr("width", outerWidth)
                .attr("height", outerHeight)
                .append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`);

let infobox = d3.select("#infobox").style("visibility", "hidden");

let mutedRed = d3.hsl(10, 0.5, 0.5);
let mutedGreen = d3.hsl(90, 0.5, 0.5);

let legend = chart.append("g")
                .attr("class", "legend")
                .attr("transform", `translate(${height - 100}, ${width - 100})`);
let g1 = legend.append("g")
                .attr("transform", "translate(0, 10)");
let g2 = legend.append("g")
                .attr("transform", "translate(0, -10)");
g1.append("circle")
            .attr("fill", mutedGreen)
            .attr("r", circleSize);
g1.append("text")
            .text("No doping allegations")
            .attr("transform", `translate(${circleSize}, ${circleSize / 2})`);
g2.append("circle")
            .attr("fill", mutedRed)
            .attr("r", circleSize);
g2.append("text")
            .text("Doping allegations")
            .attr("transform", `translate(${circleSize}, ${circleSize / 2})`);

function infoboxFormat(data) {
    return `<p>Name: ${data["Name"]}</p>
            <p>Ranking: ${data["Place"]}</p>
            <p>${(data["Doping"] === "") ? "" : `<a href=${data["URL"]}>${data["Doping"]}</a></p>`}`;
}

function render(data) {
    let firstPlaceSeconds = data.find(e => e["Place"] === 1)["Seconds"];
    
    yExtent = d3.extent(data, el => { return el["Place"]; });
    xExtent = d3.extent(data, el => { return el["Seconds"] - firstPlaceSeconds; });

    // pad the domain so the data isnt on top of the axis
    yExtent[1] += 1;
    xExtent[1] += 10;

    scaleY.domain(yExtent);
    scaleX.domain(xExtent);

    let point = chart.selectAll(".point")
                   .data(data)
    
    point.exit().remove();

    let enterPoint = point.enter().append("g")
                .attr("class", "point");
    enterPoint.append("circle")
                .attr("class", "point-circle");
    enterPoint.append("text")
                .attr("class", "point-name")
                .attr("transform", `translate(${circleSize}, ${circleSize /2})`);

    point.merge(enterPoint)
        .attr("transform", (d, i) => `translate(${scaleX(d["Seconds"] - firstPlaceSeconds)}, ${scaleY(d["Place"])})`)
        .on("mouseover", (d) => { infobox.style("visibility", "visible").html(infoboxFormat(d)); });

    point.merge(enterPoint)
        .select(".point-name")
            .text((d, i) => d["Name"]);

    point.merge(enterPoint)
        .select(".point-circle")
            .attr("r", circleSize)
            .attr("fill", (d, i) => (d["Doping"] === "") ? mutedGreen : mutedRed );




    let yAxis = d3.axisLeft(scaleY);
    let xAxis = d3.axisBottom(scaleX)
                  .tickFormat(d => d3.timeFormat("%Mm %Ss")( (new Date(2018, 0, 1, 0, 0, 0).setSeconds(d) ))).ticks(5);

    
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

function addData() {
    globalData.push(objectifyForm());
    globalData = rerankData(globalData);
    render(globalData);
}

function objectifyForm() {
    let obj = {
        "Name": document.getElementById("name-input").value,
        "Seconds": parseFloat(document.getElementById("time-input").value),
        "URL": document.getElementById("doping-source").value,
        "Doping": document.getElementById("doping-description").value
    };
    let inputs = document.getElementsByTagName("input");
    for(let i = 0; i < inputs.length; i++) {
        inputs[i].value = "";
    }
    return obj;
}

function rerankData(data) {
    data.sort((a, b) => a["Seconds"] < b["Seconds"] ? -1 : +1);
    for(i = 0; i < data.length; i++) {
        data[i]["Place"] = i+1;
    }
    return data;
}