(function(d3) {

    d3.sunburst = function(selector, datafile) {
        var width = 960,
            height = 700,
            radius = Math.min(width, height) / 2;
        
        var x = d3.scale.linear()
                    .range([0, 2 * Math.PI]);
        
        var y = d3.scale.sqrt()
                    .range([0, radius]);
        
        var color = d3.scale.category20c();
        
        var svg = d3.select(selector).append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");
        
        var partition = d3.layout.partition()
            .sort(null)
            .value(function(d) { return 1; });
        
        var arc = d3.svg.arc()
            .startAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
            .endAngle(function(d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
            .innerRadius(function(d) { return Math.max(0, y(d.y)); })
            .outerRadius(function(d) { return Math.max(0, y(d.y + d.dy)); });
        
        // Keep track of the node that is currently being displayed as the root.
        var node;
        
        var tooltip = d3.select("body").append("div")	
            .attr("class", "tooltip")				
            .style("opacity", 0);
            
        function generateTooltipHTML(d)
        {
            var tooltip = '<span class="name">' + d.firstname + ' ' + d.lastname + '</span><br/>';
            if (d.partner !== undefined)
            {
                tooltip += '<br/><span class="partner">Partner: ' + d.partner + '</span>'
            }
            if (d.role !== undefined)
            {
                tooltip += '<br/><span class="role">(' + d.role + ')</span>'
            }
            
            return tooltip;
        }
        
        function tipshow(d) {
            var tooltipHTML = generateTooltipHTML(d);
            tooltip.transition()		
                .duration(200)		
                .style("opacity", .9);		
            tooltip	.html(tooltipHTML)	
                .style("left", (d3.event.pageX) + "px")		
                .style("top", (d3.event.pageY - 28) + "px");	
        } 
        
        function tipmove(e) {
            console.log('SVG.x: ' + svg.x)
            var x = e.offsetX;
            var y = e.offsetY;
            tooltip.style("left", x + "px").style("top", y + "px")
        }
        
        function tiphide() {
            tooltip.transition()		
                        .duration(500)		
                        .style("opacity", 0);
        }
        
        document.getElementsByTagName('body')[0].addEventListener('mousemove', tipmove);
        
        d3.json(datafile, function(error, root) {
          node = root;
          var path = svg.datum(root).selectAll("path")
                        .data(partition.nodes)
                        .enter().append("path")
                        .attr("d", arc)
                        .style("fill", function(d) { return color((d.children ? d : d.parent).name); })
                        .on("click", click)
                        .on('mouseover', tipshow)
                        .on('mouseout', tiphide)
                        .each(stash);
        
            d3.selectAll("input").on("change", function change() {
                var value = this.value === "count"
                                ? function() { return 1; }
                                : function(d) { return d.size; };
        
            path.data(partition.value(value).nodes)
                .transition()
                .duration(1000)
                .attrTween("d", arcTweenData);
            });
        
            function click(d) {
                node = d;
                path.transition()
                    .duration(1000)
                    .attrTween("d", arcTweenZoom(d));
            }
        });
        
        d3.select(self.frameElement).style("height", height + "px");
        
        // Setup for switching data: stash the old values for transition.
        function stash(d) {
            d.x0 = d.x;
            d.dx0 = d.dx;
        }
        
        // When switching data: interpolate the arcs in data space.
        function arcTweenData(a, i) {
          var oi = d3.interpolate({x: a.x0, dx: a.dx0}, a);
          function tween(t) {
            var b = oi(t);
            a.x0 = b.x;
            a.dx0 = b.dx;
            return arc(b);
          }
          if (i == 0) {
           // If we are on the first arc, adjust the x domain to match the root node
           // at the current zoom level. (We only need to do this once.)
            var xd = d3.interpolate(x.domain(), [node.x, node.x + node.dx]);
            return function(t) {
              x.domain(xd(t));
              return tween(t);
            };
          } else {
            return tween;
          }
        }
        
        // When zooming: interpolate the scales.
        function arcTweenZoom(d) {
          var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
              yd = d3.interpolate(y.domain(), [d.y, 1]),
              yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
          return function(d, i) {
            return i
                ? function(t) { return arc(d); }
                : function(t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); return arc(d); };
          };
        }
    }
})(window.d3)