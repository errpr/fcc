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

function tickUpdate(n, l) {
    n
        .style("left", d => `${(d.x - (circleSize / 2)) + margin.left}px`)
        .style("top", d => `${(d.y - (circleSize / 2)) + margin.top}px`);

    l
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);
}

function render(data) {
    let nodes = data["nodes"];
    let links = data["links"];
    let link = chart.selectAll(".link")
                    .data(links)
                    .enter()
                    .append('line')
                    .attr('class', 'link')
                    .attr("stroke-width", 2);

    let node = d3.select("#root").selectAll(".node")
                    .data(nodes)
                    .enter()
                    .append('div')
                    .attr('class', d => `flag flag-${d["code"]} node`)
                    .on("mouseover", d => infobox.style("visibility", "visible").html(infoboxFormat(d)))
                    .on("mousemove", d => infobox.style("left", (d3.event.pageX + 10) + "px").style("top", (d3.event.pageY + 10) + "px"))
                    .on("mouseout", d => infobox.style("visibility", "hidden"));

    layout.nodes(nodes)
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("charge", d3.forceManyBody())
            .force("link", d3.forceLink(links))
            .on("tick", () => tickUpdate(node, link));

}

d3.json("countries.json", (e, d) => {
    globalData = d;
    
    render(d);
});

function addData() {
    let newIndex = globalData["nodes"].length
    globalData["nodes"].push(objectifyCountry(newIndex));
    globalData["links"].concat(objectifyNeighbors(newIndex));

    render(globalData);
}

function objectifyCountry(index) {
    let neighbors = document.getElementById("neighbor-input")
                    .value.split(",")
                    .map(e => {
                        let t = globalData["nodes"].findIndex(x => x["country"].toLowerCase() === e.trim().toLowerCase());
                        if(t < 0) { return; }
                        return { 
                            "target": t, 
                            "source": index 
                        }; 
                    });
    console.log(neighbors);
    document.getElementById("neighbor-input").value = "";
    return neighbors;
}

function objectifyNeighbors(index) {
    let obj = {
        "country": document.getElementById("name-input").value,
        //"code": document.getElementById("code-input").value,
    };
    document.getElementById("name-input").value = "";
    //document.getElementById("code-input").value = "";
    return obj;
}