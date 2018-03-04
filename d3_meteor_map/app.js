let globalData;

const margin = { top: 50, right: 50, bottom: 50, left: 50 };

const outerWidth = 800;
const outerHeight = 600;

const width = outerWidth - margin.left - margin.right;
const height = outerHeight - margin.top - margin.bottom;

let svg = d3.select("#root")
                .append("svg")
                .attr("width", outerWidth)
                .attr("height", outerHeight)
                .call(d3.zoom().on("zoom", () => chart.attr("transform", d3.event.transform) ));
let chart = svg.append("g")
                .attr("transform", `translate(${margin.left}, ${margin.top})`)

let infobox = d3.select("#infobox").style("visibility", "hidden");

function infoboxFormat(data) {
    return `<p>${data["name"]}</p>
            <p>Year: ${new Date(Date.parse(data["year"])).getFullYear()}</p>
            <p>Mass: ${data["mass"]}</p>`;
}

function render(geoData, meteorData) {
    let projection = d3.geoMercator().scale(1000).translate([width / 2, height / 2])

    let geoPath = d3.geoPath().projection(projection);
    let map = chart.append("path").datum(geoData)
        .attr("d", geoPath)
        .attr("fill", "#333")
        .attr("stroke", "#fff");
    let scaleExtent = d3.extent(meteorData.features.reduce((a, e) => { a.push(+e["properties"]["mass"]); return a }, []));
    scaleExtent[1] /= 4; // some huge meteor nuked vladivostok, its throwing the circle size off
    let scaleMass = d3.scaleLinear()
        .range([3, 200])
        .domain(scaleExtent)
        .clamp(true);
    let geoPath2 = d3.geoPath().projection(projection).pointRadius(d => scaleMass(d["properties"]["mass"]))
    let strikes = chart.selectAll(".meteorPath")
        .data(meteorData.features)
        .enter()
        .append("path")
            .attr("class", "meteorPath")
            .attr("d", geoPath2)
            .attr("fill", d3.hsl(120, 0.5, 0.5))
            .style("width", 50)
            .on("mouseover", d => infobox.style("visibility", "visible").html(infoboxFormat(d["properties"])))
            .on("mousemove", d => infobox.style("left", (d3.event.pageX + 10) + "px").style("top", (d3.event.pageY + 10) + "px"))
            .on("mouseout", d => infobox.style("visibility", "hidden"))
}

d3.json("custom.geo.json", (e, d) => {
    d3.json("meteorite-strike-data.json", (e2, d2) => {
        globalData = d2;
    
        render(d, d2);
    });
});