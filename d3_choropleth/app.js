/*
[
	{
		"fips": 1001,
		"state": "AL",
		"area_name": "Autauga County",
		"bachelorsOrHigher": 21.9
    },
] 
*/
const TITLE = "Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)"
const files = ["counties.json", "for_user_education.json"];

const width = 960;
const height = 600;
const path = d3.geoPath();

const svg = d3.select("svg")
    .style("width", "100vw")
    .style("height", "100vh");

Promise.all(files.map(url => d3.json(url))).then(values => {

    const counties = topojson.feature(values[0], {
        type: "GeometryCollection",
        geometries: values[0].objects.counties.geometries
    });

    const edData = new Map(values[1].map(d => [d.fips, d.bachelorsOrHigher]))
    const edValues = [];
    edData.forEach(e => edValues.push(e));

    const g = svg.append("g")
    .attr("transform", "translate(0,40)");

    const color = d3.scaleQuantize()
        .domain(d3.extent(edValues))
        .range(d3.schemeBlues[9])
        
    const x = d3.scaleLinear()
        .domain(d3.extent(color.domain()))
        .rangeRound([600, 860]);

    g.selectAll("rect")
        .data(color.range().map(d => color.invertExtent(d)))
        .enter().append("rect")
            .attr("height", 8)
            .attr("x", d => x(d[0]))
            .attr("width", d => x(d[1]) - x(d[0]))
            .attr("fill", d => color(d[0]));

    g.append("text")
        .attr("class", "caption")
        .attr("x", x.range()[0])
        .attr("y", -6)
        .attr("fill", "#000")
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(TITLE);

    g.call(d3.axisBottom(x)
        .tickSize(13)
        .tickFormat(d3.format(""))
        .tickValues(color.range().slice(1).map(d => color.invertExtent(d)[0])))
    .select(".domain")
        .remove();

    svg.append("g")
        .selectAll("path")
        .data(counties.features)
        .enter().append("path")
            .attr("fill", d => color(edData.get(d.id)))
            .attr("d", path)
            .attr("class", "county")
            .attr("data-fips", d => d.id)
            .attr("data-education", d => edData.get(d.id))

}).catch(error => console.log(error));