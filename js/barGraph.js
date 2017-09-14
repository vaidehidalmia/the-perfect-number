var slugify = function (string) {
  return string
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

var loadBarData = function (data) {
    var margin = {
        top: 10,
        right: 10,
        bottom: 20,
        left: 30
    },
    width = 920 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

    var x = d3.scaleBand()
        .range([0, width, .1, 1]);

    var y = d3.scaleLinear()
        .range([height, 0]);

    var xAxis = d3.axisBottom()
        .scale(x)
        .tickFormat(d3.format("d"));

    var yAxis = d3.axisLeft()
        .scale(y);

    var barSVG = d3.select("#chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    data = data.sort(function(a,b) { return b.rate - a.rate; })

    x.domain(data.map(function(d) {
        return d.company_name;
    }));
    y.domain(d3.extent(data, function(d) {
        return d.rate;
    })).nice();

    barSVG.append("g")
        .attr("class", "line35")
        .append("line")
        .attr("x1", 0)
        .attr("x2", 0)
        .attr("y1", y(35))
        .attr("y2", y(35))
        .transition()
        .duration(1000)
        .attr("x2", width)

    barSVG.append("g")
        .attr("class", "axis")
        .append("line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", y(0))
        .attr("y2", y(0))
        .style('opacity', 0)
        .transition()
        .duration(3000)
        .style('opacity', 1);

    var bars = barSVG.selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("id", function(d) { 
            return slugify(d.company_name) + '-path';
        })
        .attr("class", function(d) {
            if (d.rate < 0){
                return "bar negative";
            } else {
                return "bar positive";
            }
        })
        .attr("x", function(d) {
            return x(d.company_name);
        })
        .attr("y", function(d) {
            return y(0);
        })
        .attr("width", 2)
        .attr("height", 0)
        // // .on("mouseover", function(d){
        // //     d3.select("#_yr")
        // //         .text("Company: " + d.company_name);
        // //     d3.select("#degree")
        // //         .text("Rate: " + d.rate + "%");
        // // })
        .transition()
        .duration(10)
        .delay(function (d, i) {
            return i * 20;
        })
        .attr("y", function(d) {
            if (d.rate > 0){
                return y(d.rate);
            } else {
                return y(0);
            }
        })
        .attr("height", function(d) {
            return Math.abs(y(d.rate) - y(0));
        })
        .end(function() {
            yearsNoTax();
            // transitionTo92();
        });
}

var fadeBars = function (opacity) {
    d3.selectAll('.bar')
        .transition()
            .duration(300)
            .delay(function (d, i) {
                return i * 10;
            })
        .style('opacity', opacity);

}

var highlightBars = function (str) {
   d3.selectAll(str)
        .transition()
            .duration(500)
            .delay(function (d, i) {
                return i * 1000;
            })
        .style('fill', 'black')
        .style('opacity', 1)
        .attr("width", 3);

}

var yearsNoTax = function () {
    fadeBars(0.5);
    highlightBars('#molina-healthcare-path, #centene-path, #wec-path');
}

var transitionTo92 = function() {
    d3.selectAll('.bar')
        .transition()
            .duration(100)
        .style('opacity', 0);
    highlightBars('#molina-healthcare-path, #centene-path, #wec-path');
}
