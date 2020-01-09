
// Shape of our pie chart
var width  = d3.select('#pie-chart').node().offsetWidth,
    height = 1200,
    cwidth = 60;

// Color stuff        
var colorLeitsatz = '#3b515b';
colorA = '#5EADBF',
colorB = '#BF8888',
colorC = '#D96B62',
colorD = '#F25041',
colorE = '#e2001a',
colorF = '#c90018';

//legend
var rings = ["Professuren", "Schwerpunkte", "Studiengänge", "Inneruniversitäre Kooperationen", "Außeruniversitäre Kooperationen", "Projekte"];

var ringColorLegend_function = function(ring){
    switch (ring) {
        case "Professuren":
            return colorA;
            break;
        case "Schwerpunkte":
            return colorB;
            break;
        case "Studiengänge":
            return colorC;
            break;
        case "Inneruniversitäre Kooperationen":
            return colorD;
            break;
        case "Außeruniversitäre Kooperationen":
            return colorE;
            break;
        case "Projekte":
            return colorF;
        } 
};

var color_function = function(i){
    switch (i) {
        case 0:
            return colorLeitsatz;
            break;
        case 1:
            return colorA;
            break;
        case 2:
            return colorB;
            break;
        case 3:
            return colorC;
            break;
        case 4:
            return colorD;
            break;
        case 5:
            return colorE;
            break;
        case 6:
            return colorF;
        } 
};

/*gives the same numeric value to every object in the datafile (cuz they dont have numeric values)  
Turn the pie chart 90 degrees counter clockwise, so it starts at the left*/     
var pie = d3.pie()
    .value(function(d){return 1});

/* Select the SVG container using the select() method and inject the SVG element g using the append() method, also
add labels */
var svg = d3.select("#pie-chart svg")
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
    .append("g")
    .attr("class", "labels");


d3.json("./data/unidata.json").then(function(data){
    console.log(data);
    // create a new arc generator   
    var arc = d3.arc();

    /* all svg elements, bind the values of the dataset to data.  .data joins an array of data 
    with the current selection g - every data element gets assigned to an g */
    var gs = svg.selectAll("g")
                .data(d3.values(data))
                .enter()
                .append("g")

    // init tooltip
    var tip = d3.tip()
                .attr('class', 'd3-tip')
                .html(function(d) {
                    var text = "<strong> <span style='color:white'>" + d.data.name + "</strong></span><br>" + "<br>";
                    text += "Anklicken für mehr Info"; 
                                   
                    return text;
                });

    // call tooltip
    gs.call(tip);

    //Legend
    var legend = svg.append("g")
                    .attr("transform", "translate(-450,-500)") // TO DO: no hardcoded numbers
                    /*.attr("transform", "translate(" + (width - 10) + 
                        "," + (height - 10) + ")");*/

    rings.forEach(function(ring, i){
        var legendRow = legend.append("g")
            .attr("transform", "translate(0, " + (i * 30) + ")");

        legendRow.append("text")
            .attr("x", -20)
            .attr("y", 15)
            .attr("text-anchor", "end")
            .style("font-size", "15px")
            .text(ring)
            ;
        legendRow.append("rect")
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", ringColorLegend_function(ring)
            );    
    });

    //tooltipdetails
    var tooltipDetails = svg.append("g")
                            .attr("transform", "translate(450,-500)") 
                            .attr('id', 'details')



    // the graph
    /*takes all dataentries binded to a g (gs) and binds them to a path. every datapath gets also an ringIndex
    each arc/path will be filled according to the ringindex
    d attr defines a path to be drawn, every path has its own innder and outer radius due to the ringindex
    then the eventlisteners are there for the tool tips */
    // This dictionary is used to store the center point of all the visible arcs so we can later
    // use it to create hidden ones formula is : (innerRadius + outerRadius) / 2
    var arcIndexDictionary = {};
    var arcRingIndexSizeDictionary = {};
    var arcLineCountDictionary = {};

    // Visible arc
    gs.selectAll("path")
        .data(function(d,i) {       
            return pie(d).map(function(e){e.ringIndex = i; return e});
        })
        .enter()
        .append("path")
        .attr("class", "nameArc")
        .attr("id", function(d,i) { 
            return d.data.name + "nameArc_"+i+i; 
        }) //Unique id for each slice
        .attr("d", 
            function(d, i) {
                var innerRadius = cwidth * d.ringIndex;
                var outerRadius = cwidth * (d.ringIndex + 1);
                var innerRadiusSlim = (cwidth * d.ringIndex) + 1.75 *cwidth;
                var outerRadiusSlim = cwidth * (d.ringIndex + 1) + 1.75 * cwidth;
                // We need how many items are there in a ring in order to decide which text to flip
                arcRingIndexSizeDictionary[d.ringIndex] = i;
                // Main Arc
                if (d.ringIndex == 0){
                    arcIndexDictionary[d.data.name + "nameArc_"+i] = (innerRadius + outerRadius) / 2.04;
                    return arc.innerRadius(innerRadius).outerRadius(outerRadius)(d);
                }
                else if (d.ringIndex == 1){
                    arcIndexDictionary[d.data.name + "nameArc_"+i] = (innerRadius + outerRadiusSlim) / 2.04; //not in use atm
                    return arc.innerRadius(innerRadius).outerRadius(outerRadiusSlim)(d);
                }
                else if ( d.ringIndex > 1) {
                arcIndexDictionary[d.data.name + "nameArc_"+i] = (innerRadiusSlim + outerRadiusSlim) / 2.04;
                return arc.innerRadius(innerRadiusSlim).outerRadius(outerRadiusSlim)(d); 
                }
            }
        )
        .attr("fill", function(d, arrayindex, j) {
            return color_function(d.ringIndex);
        })
        .attr("name", function(d) {
                return d.data.name
            })
        .attr("coop", function(d) {
            return d.data.kooperationen
            })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide) 
        //interaction highlight connections/ cooperations 
        .on('click', function(d) {
       

            var current = d3.select(this).attr("name");
            var coops = d3.select(this).attr("coop");
            console.log(current); 

            // reset to normal                
            if (d3.select(this).style('opacity') == 0.3) {
                        d3.selectAll("path")
                            .style('opacity', 1);
                            return; }

            d3.selectAll("path")
                        .filter(function(d) {
                            if (coops != null){   // if there arent coops it mfades everything, otheriwse not clickable and typeerror
                            var fadedArcs = d3.select(this).attr("name") != current &&
                            coops.includes(d3.select(this).attr("name")) == false;
                            return fadedArcs; 
                            } else { 
                                var fadedArcs = d3.select(this).attr("name") != current;
                                console.log("No cooperations found");
                                return fadedArcs;
                            };
                        })
                        .style('opacity', 0.3)
        ; 

        

        
            //tooltipdetails
            d3.select("#details").selectAll("#text").remove();
            var i = 0;
            var lineLengthDictionary = [];
            for ( var key in d.data){
                if(d.data[key] != "" && d.data[key] != null && d.data[key].length != 0){
                  lineLengthDictionary.push(Math.ceil(d.data[key].length / 28.0));  
                } else {
                    lineLengthDictionary.push("0")
                }
                
            }

            
            var hadTwoLines = function(i){
                console.log(i)
                for (var j = 0; j <= (i-1); j++){
                    if (lineLengthDictionary[j] == 2) {                       
                        return true;
                    }
            }
            return false;
        }


            for (var key in d.data) {

                if (d.data[key] != "" && d.data[key] != null && d.data[key].length != 0){
                    i = i + 1;
                    var tooltipRow = tooltipDetails.append("g")
                        .attr("transform", function(){
                            if (i - 1 != 0 && lineLengthDictionary[i-2] > 1){ //not headline and previous one more than one line
                                //console.log(key + ":" + (((i-1) * 20) + 20))
                                return "translate(0, " + ((((i-1) * 20) + lineLengthDictionary[i-2])) + ")" 
                            } else if (i - 1 != 0 && hadTwoLines(i) == true){ //
                                console.log("hallo")
                                //console.log(key + ":" + (((i-1) * 20) + 20))
                                return "translate(0, " + ((((i-1) * 20) + 30)) + ")"
                            } else if(i - 1 != 0) { //not the headline
                                console.log(key + ": keine Doppellinie" +  (((i-1) * 20)))
                                //console.log(hadTwoLines())
                               return "translate(0, " + (((i-1) * 20)) + ")"  
                            }
                        
                        });
              
                    tooltipRow.append("text")
                        .attr("id", "text")
                        .attr("x", -20)
                        .attr("y", 15)
                        .attr("text-anchor", "start")
                        .style("font-size", "15px")
                        .text("")
                    ;  

                    tooltipRow.select("text")
                                .style("font-size", function(){
                                    if (key == "name"){
                                        return "20px";
                                    }else {
                                        return "15px";
                                    }
                                })
                                .style("font-weight", function(){
                                    if (key == "name"){
                                        return "600";
                                    
                                }})
                                .text(function(){
                                        return d.data[key]               
                                })
                                .each(function(d){
                                    wrap(this, 220, 0)
                                })
                }
            }}
    )
    ;

 

    // Invisible arc
    gs.selectAll("hiddenPath")
        .data(function(d,i) {       
            return pie(d).map(function(e){e.ringIndex = i; return e});
        })
        .enter()
        .append("path")
        .attr("class", "textArc")
        .attr("id", function(d,i) { 
            // We do not use textArc ids yet but might be useful in the long run
            return d.data.name + "textArc_"+i; 
        }) //Unique id for each hidden slice
        .attr("d", 
            function(d, i) {
                // Get the middle of the current arc
                var radius = arcIndexDictionary[d.data.name + "nameArc_"+i];
                // Place the hidden arc
                var newHiddenArc = arc.innerRadius(radius).outerRadius(radius)(d);

                //If the end angle lies beyond a quarter of a circle (90 degrees or pi/2) 
                //flip the end and start position
                var ringItemCount = arcRingIndexSizeDictionary[d.ringIndex];
                if(i > ringItemCount/4 && i < ringItemCount * 3/4){
                    var startLoc 	= /M(.*?)A/,		//Everything between the first capital M and first capital A
                        middleLoc 	= /A(.*?)0,0,1/,	//Everything between the first capital A and 0 0 1
                        endLoc 		= /0,0,1(.*?)$/;	//Everything between the first 0 0 1 and the end of the string (denoted by $)
                    //Flip the direction of the arc by switching the start en end point (and sweep flag)
                    //of those elements that are below the horizontal line
                    var newStart = endLoc.exec( newHiddenArc );
                    var newEnd = startLoc.exec( newHiddenArc );
                    var middleSec = middleLoc.exec( newHiddenArc );
                    
                    if(newStart != null && newEnd != null && middleSec != null) {
                        var modifiedHiddenArc = "M" + newStart[1].substring(1) + "A" + middleSec[1] + "0,0,0," + newEnd[1];
                        return modifiedHiddenArc;
                    }
                    else
                        return newHiddenArc;
                }//if
                else
                    return newHiddenArc;
            }
        )
        .attr("fill", "none");


        
    // text wrap function
    function wrap(text2, width, ringIndex) {
        var text = d3.select(text2),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            y = text.attr("y"),
            tspan = text.text(null)
                        .append("tspan")
                        .attr("x", 0) 
                        .attr("y", y) 
        while (word = words.pop()) {
        line.push(word)
        tspan.text(line.join(" "))
        if (tspan.node().getComputedTextLength() > width) {
            line.pop()
            tspan.text(line.join(" "))
            line = [word]
            tspan = text.append("tspan")
                        .attr("x", 0) 
                        .attr("y", y) 
                        .attr("dy", ++lineNumber * lineHeight + "em")
                        .text(word)
        }
        }
        // +1 because if there are no tspans word itself is a line
        return lineNumber + 1;
    }



    // Placing text
    gs.selectAll(".nameText")
        .data(function(d,i) {       
            return pie(d).map(function(e){e.ringIndex = i; return e});
        })
        .enter()
        .append("text")
            .attr("class", "nameText")  
            .attr('dy', function(d, i, array){
            var ringItemCount = arcRingIndexSizeDictionary[d.ringIndex];
        }) 
        .append("textPath")
            .attr("xlink:href",function(d, i, array){
                if (d.ringIndex > 1) 
                    {return "#" + d.data.name + "textArc_"+i} //TO DO: inner ring needs to switch text as well,  high prio
                else{
                    return "#" + d.data.name + "nameArc_"+i+i;   }
                ;
        })
            .style("text-anchor", function(d, i){
                if (d.ringIndex > 1) 
                    return "middle";})
            .attr("startOffset", function(d, i){ 
                if(d.ringIndex == 1) return "12%";   
                var ringItemCount = arcRingIndexSizeDictionary[d.ringIndex];
                if(i > ringItemCount/4 && i < ringItemCount * 3/4)
                    return "17%"; // TO DO: not a hardcoded number? textlength matters
                return "25%";
            })
        
        .text(function(d, i, array){ 
            if (d.ringIndex > 0)
            {return d.data.name};
        })
            .style('font-family', 'arial')
            .attr('font-size', function(d){
                if(d.ringIndex > 1){return '15px'} else {
                    return '10px';
                }})
        .each(function(d) {
            var lineNo = wrap(this, 180, d.ringIndex);
            arcLineCountDictionary[d.data.name] = lineNo;
        });

    // Centralize everything
    gs.selectAll("text")
        .attr('dy', function(d, i, array){
            var lineCount = arcLineCountDictionary[d.data.name];
            var ringItemCount = arcRingIndexSizeDictionary[d.ringIndex];
            // inner text ring 
            if (d.ringIndex == 1){
                    return "8"};
            //upper
            if(i <= ringItemCount/4 || i >= ringItemCount * 3/4){
                if(d.ringIndex > 1 && lineCount == 1){
                    return "0";   
                };
                if (d.ringIndex > 1 && lineCount > 1)
                {return -4.5 * lineCount};
                };
            //lower
            if(i > ringItemCount/4 && i < ringItemCount * 3/4){
                if(d.ringIndex > 1 && lineCount == 1){
                    return "12";   
                };
                if (d.ringIndex > 1 && lineCount > 1)
                {return 2 * lineCount};
        }
        });

    gs.append("text")
        .attr("text-anchor", "middle")
        .attr('font-size', '0.8em')
        .attr('font-family', 'arial')
        .style('fill', 'white')
        .text("Human-Centered")
        .append('tspan')
        .text("Complex Systems")
            .attr('dy', '1.25em')
            .attr('dx','-7.75em')
})




