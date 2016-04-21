(function(d3) {
    d3.circletree = function(selector, datafile) {

        var w = 1280,
            h = 800,
            rx = w / 2,
            ry = h / 2,
            m0,
            rotate = 0;
    
        var cluster = d3.layout.cluster()
            .size([360, ry - 120])
            .sort(null);
    
        var diagonal = d3.svg.diagonal.radial()
            .projection(function(d) {
                return [d.y, d.x / 180 * Math.PI];
            });
    
        var svg = d3.select(selector).append("div")
            .style("width", w + "px")
            .style("height", w + "px");
    
        var vis = svg.append("svg:svg")
            .attr("width", w)
            .attr("height", w)
            .append("svg:g")
            .attr("transform", "translate(" + rx + "," + ry + ")");
    
        vis.append("svg:path")
            .attr("class", "arc")
            .attr("stroke", "black")
            .attr("d", d3.svg.arc().innerRadius(ry - 120).outerRadius(ry).startAngle(0).endAngle(2 * Math.PI));
            //.on("mousedown", mousedown);

        d3.json(datafile, function(json) {
            var nodes = cluster.nodes(json);
    
            var link = vis.selectAll("path.link")
                .data(cluster.links(nodes))
                .enter().append("svg:path")
                .attr("class", "link")
                .attr("stroke", function(d) {
                    return (d.target.color ? d.target.color : "black")
                })
                .attr("d", diagonal);
    
            var node = vis.selectAll("g.node")
                .data(nodes)
                .enter().append("svg:g")
                .attr("class", "node")
                .attr("transform", function(d) {
                    return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
                })
    
            node.append("svg:circle")
                .attr("r", 3);
    
            node.append("svg:text")
                .attr("dx", function(d) {
                    return d.x < 180 ? 8 : -8;
                })
                .attr("dy", ".31em")
                .attr("text-anchor", function(d) {
                    return d.x < 180 ? "start" : "end";
                })
                .attr("transform", function(d) {
                    return d.x < 180 ? null : "rotate(180)";
                })
                .style('fill', function(d) {return d.color})
                .text(function(d) {
                    return (d.firstname ? d.firstname + ' ' + d.lastname : d.name);
                });
                
            // window.document.getElementById('remove').addEventListener('click', function() {
            //     var nodeId = window.document.getElementById('input').value;
            //     console.log('Removing Node: ' + nodeId)
            //     var nodeSet = nodes.filter(function(d) {
            //         console.log('Node Name: ' + d.name)
            //         return d.name === nodeId;
            //     });
            //     nodeSet = vis.selectAll("g.node").data(nodes).enter().filter(function(d) {
            //         console.log('Node Name: ' + d.name);
            //         return d.name === nodeId;
            //     }).exit().remove();
            //     // console.log('Node Set: ' + nodeSet);
            //     // nodeSet.exit().remove();
            // });                
        });
        

        
        // d3.select(window)
        //     .on("mousemove", mousemove)
        //     .on("mouseup", mouseup);
    
        // function mouse(e) {
        //     return [e.pageX - rx, e.pageY - ry];
        // }
    
        // function mousedown() {
        //     m0 = mouse(d3.event);
        //     d3.event.preventDefault();
        // }
    
        // function mousemove() {
        //     if (m0) {
        //         var m1 = mouse(d3.event),
        //             dm = Math.atan2(cross(m0, m1), dot(m0, m1)) * 180 / Math.PI,
        //             tx = "translate3d(0," + (ry - rx) + "px,0)rotate3d(0,0,0," + dm + "deg)translate3d(0," + (rx - ry) + "px,0)";
        //         svg
        //             .style("-moz-transform", tx)
        //             .style("-ms-transform", tx)
        //             .style("-webkit-transform", tx);
        //     }
        // }
    
        // function mouseup() {
        //     if (m0) {
        //         var m1 = mouse(d3.event),
        //             dm = Math.atan2(cross(m0, m1), dot(m0, m1)) * 180 / Math.PI,
        //             tx = "rotate3d(0,0,0,0deg)";
    
        //         rotate += dm;
        //         if (rotate > 360) rotate -= 360;
        //         else if (rotate < 0) rotate += 360;
        //         m0 = null;
    
        //         svg
        //             .style("-moz-transform", tx)
        //             .style("-ms-transform", tx)
        //             .style("-webkit-transform", tx);
    
        //         vis
        //             .attr("transform", "translate(" + rx + "," + ry + ")rotate(" + rotate + ")")
        //             .selectAll("g.node text")
        //             .attr("dx", function(d) {
        //                 return (d.x + rotate) % 360 < 180 ? 8 : -8;
        //             })
        //             .attr("text-anchor", function(d) {
        //                 return (d.x + rotate) % 360 < 180 ? "start" : "end";
        //             })
        //             .attr("transform", function(d) {
        //                 return (d.x + rotate) % 360 < 180 ? null : "rotate(180)";
        //             });
        //     }
        // }
    
        // function cross(a, b) {
        //     return a[0] * b[1] - a[1] * b[0];
        // }
    
        // function dot(a, b) {
        //     return a[0] * b[0] + a[1] * b[1];
        // }
    };

// http://stackoverflow.com/questions/11589308/d3-js-how-to-dynamically-add-nodes-to-a-tree

// function update(source) {
//   var duration = d3.event && d3.event.altKey ? 5000 : 500;

//   // Compute the new tree layout.
//   var nodes = tree.nodes(root).reverse();

//   // Normalize for fixed-depth.
//   nodes.forEach(function(d) { d.y = d.depth * 180; });

//   // Update the nodes…
//   var node = vis.selectAll("g.node")
//       .data(nodes, function(d) { return d.id || (d.id = ++i); });

//   // Enter any new nodes at the parent's previous position.
//   var nodeEnter = node.enter().append("svg:g")
//       .attr("class", "node")
//       .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
//       .on("click", function(d) { toggle(d); update(d); });

//   nodeEnter.append("svg:circle")
//       .attr("r", 1e-6)
//       .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

//   nodeEnter.append("svg:text")
//       .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
//       .attr("dy", ".35em")
//       .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
//       .text(function(d) { return d.name; })
//       .style("fill-opacity", 1e-6);

//   // Transition nodes to their new position.
//   var nodeUpdate = node.transition()
//       .duration(duration)
//       .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

//   nodeUpdate.select("circle")
//       .attr("r", 4.5)
//       .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

//   nodeUpdate.select("text")
//       .style("fill-opacity", 1);

//   // Transition exiting nodes to the parent's new position.
//   var nodeExit = node.exit().transition()
//       .duration(duration)
//       .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
//       .remove();

//   nodeExit.select("circle")
//       .attr("r", 1e-6);

//   nodeExit.select("text")
//       .style("fill-opacity", 1e-6);

//   // Update the links…
//   var link = vis.selectAll("path.link")
//       .data(tree.links(nodes), function(d) { return d.target.id; });

//   // Enter any new links at the parent's previous position.
//   link.enter().insert("svg:path", "g")
//       .attr("class", "link")
//       .attr("d", function(d) {
//         var o = {x: source.x0, y: source.y0};
//         return diagonal({source: o, target: o});
//       })
//     .transition()
//       .duration(duration)
//       .attr("d", diagonal);

//   // Transition links to their new position.
//   link.transition()
//       .duration(duration)
//       .attr("d", diagonal);

//   // Transition exiting nodes to the parent's new position.
//   link.exit().transition()
//       .duration(duration)
//       .attr("d", function(d) {
//         var o = {x: source.x, y: source.y};
//         return diagonal({source: o, target: o});
//       })
//       .remove();

//   // Stash the old positions for transition.
//   nodes.forEach(function(d) {
//     d.x0 = d.x;
//     d.y0 = d.y;
//   });
// }

})(window.d3)