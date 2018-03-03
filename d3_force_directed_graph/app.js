let globalData;

const margin = { top: 50, right: 50, bottom: 50, left: 50 };

const outerWidth = 900;
const outerHeight = 1000;
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

    let dragHandler = d3.drag()
                        .on("start", d => {
                            if (!d3.event.active) { layout.alphaTarget(0.3).restart(); }
                            d.fx = d.x;
                            d.fy = d.y;
                        })
                        .on("end", d => {
                            layout.alphaTarget(0).restart();
                            d.fx = null;
                            d.fy = null;
                        })
                        .on("drag", d => { 
                            d.fx = d3.event.x;
                            d.fy = d3.event.y; 
                        });

    let node = d3.select("#root").selectAll(".node")
                    .data(nodes)
                    .enter()
                    .append('div')
                    .attr('class', d => `flag flag-${d["code"]} node`)
                    .on("mouseover", d => infobox.style("visibility", "visible").html(infoboxFormat(d)))
                    .on("mousemove", d => infobox.style("left", (d3.event.pageX + 10) + "px").style("top", (d3.event.pageY + 10) + "px"))
                    .on("mouseout", d => infobox.style("visibility", "hidden"));
    dragHandler(node);
    layout.nodes(nodes)
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collide", d3.forceCollide(24))
            .force("link", d3.forceLink(links).distance(100))
            .on("tick", () => tickUpdate(node, link))
            .alphaDecay(0.02)

}

d3.json("countries.json", (e, d) => {
    globalData = d;
    
    render(d);
});