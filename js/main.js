var margin = { left:80, right:100, top:50, bottom:100 },
    height = 1200 - margin.top - margin.bottom, 
    width = 1280 - margin.left - margin.right,
    cwidth = 50;

var svg = d3.select("#pie-chart svg")
    .append("g")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("transform", "translate(" + 525 + "," + 450 + ")")
    .append("g")

/*gives the same numeric value to every object in the datafile (cuz they dont have numeric values) */     
var pie = d3.pie()
    .value(function(d){return 1}); 

// Colors       
var colorLeitsatz = '#3b515b';
colorProfessuren = '#5EADBF',
colorSchwerpunkte = '#BF8888',
colorStudiengaenge = '#D96B62',
colorInKoop = '#F25041',
colorAuKoop = '#e2001a',
colorProjekte = '#c90018';

//legend
var rings = ["Professuren", "Schwerpunkte", "Studiengänge", "Inneruniversitäre Kooperationen", "Außeruniversitäre Kooperationen", "Projekte"];

var ringColorLegendFunction = function(ring){
    switch (ring) {
        case "Professuren":
            return colorProfessuren;
            break;
        case "Schwerpunkte":
            return colorSchwerpunkte;
            break;
        case "Studiengänge":
            return colorStudiengaenge;
            break;
        case "Inneruniversitäre Kooperationen":
            return colorInKoop;
            break;
        case "Außeruniversitäre Kooperationen":
            return colorAuKoop;
            break;
        case "Projekte":
            return colorProjekte;
        } 
};

var colorRingFunction = function(i){
    switch (i) {
        case 0:
            return colorLeitsatz;
            break;
        case 1:
            return colorProfessuren;
            break;
        case 2:
            return colorSchwerpunkte;
            break;
        case 3:
            return colorStudiengaenge;
            break;
        case 4:
            return colorInKoop;
            break;
        case 5:
            return colorAuKoop;
            break;
        case 6:
            return colorProjekte;
        } 
};

d3.json("./data/unidata.json").then(function(data){

    //console.log(data);  
    var arc = d3.arc();

    var gs = svg.selectAll("g")
                .data(d3.values(data))
                .enter()
                .append("g")
                .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

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
                    .attr("transform", "translate(" + (width - 1545) + 
                        "," + (height - 1425) + ")");

    var linesLegendCount;

    rings.forEach(function(ring, i){
        var legendRow = legend.append("g")
            .attr("transform", "translate(" + 0 + " ," + (i * 40) + ")");

        legendRow.append("text")
            .attr("text-anchor", "start")
            .style("font-size", "15px")
            .text(ring)
            .each(function(d){ 
                linesLegendCount = wrap(this, 200, 0)
            })
            .attr("x", 20)
            .attr("y", function(){
                if (linesLegendCount == 2){
                    return 7;
                }  
                return 15;
            })
            ;
        legendRow.append("rect")
            .attr("x", -30)
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", ringColorLegendFunction(ring)
            );    
    });

    //tooltipdetails
    var tooltipDetails = svg.append("g")
                            .attr("transform", "translate(" + (width - 575) + 
                            "," + (height - 1420) + ")")
                            .attr('id', 'details')
                            
    // the graph
    /*every datapath gets also an ringIndex
    each arc/path will be filled according to the ringindex
    d attr defines a path to be drawn, every path has its own innder and outer radius due to the ringindex
    event listeners for tooltip
    dictionary is used to store the center point of all the visible arcs so it can be used later to create hidden ones 
    formula is : (innerRadius + outerRadius) / 2
    */

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
        })
        .attr("d", 
            function(d, i) {
                var innerRadius = cwidth * d.ringIndex;
                var outerRadius = cwidth * (d.ringIndex + 1);
                var innerRadiusSlim = (cwidth * d.ringIndex) + 1.75 *cwidth;
                var outerRadiusSlim = cwidth * (d.ringIndex + 1) + 1.75 * cwidth;
                // stores how many items are there in a ring in order to decide which text to flip
                arcRingIndexSizeDictionary[d.ringIndex] = i;
                // Main Arc - draws the rings
                if (d.ringIndex == 0){
                    arcIndexDictionary[d.data.name + "nameArc_"+i] = (innerRadius + outerRadius) / 2.0;
                    return arc.innerRadius(innerRadius).outerRadius(outerRadius)(d);
                }
                else if (d.ringIndex == 1){
                    arcIndexDictionary[d.data.name + "nameArc_"+i] = (innerRadius + outerRadiusSlim) / 2.04; 
                    return arc.innerRadius(innerRadius).outerRadius(outerRadiusSlim)(d);
                }
                else if ( d.ringIndex > 1) {
                arcIndexDictionary[d.data.name + "nameArc_"+i] = (innerRadiusSlim + outerRadiusSlim) / 2.04;
                return arc.innerRadius(innerRadiusSlim).outerRadius(outerRadiusSlim)(d); 
                }
            }
        )
        .attr("fill", function(d, arrayindex, j) {
            return colorRingFunction(d.ringIndex);
        })
        .attr("name", function(d) {
                return d.data.name
            })
        .attr("coop", function(d) {
            return d.data.Kooperationspartner
            })
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide) 

        //interaction highlight connections/ cooperations + show details
        .on('click', function(d) {
       
            var current = d3.select(this).attr("name");
            var coops = d3.select(this).attr("coop"); 

            // reset to normal                
            if (d3.select(this).style('opacity') == 0.3) {
                        d3.selectAll("path")
                            .style('opacity', 1);
                        d3.selectAll(".nameText").style('opacity', 1);
                            return; }
                        
            // filter, change opa of the items that are not selected
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
            d3.selectAll(".nameText").filter(function(d){
                if (coops != null){
                var fadedArcs = coops.includes(d.data.name) == false && (d.data.name != current)
                return fadedArcs;}
                else {
                    return d.data.name != current;
                }
            })
            .style('opacity', 0.3)  
        
            //tooltipdetails
            d3.select("#details").selectAll("#text").remove();
            var i = 0;
            var linesCount;
            var lineCountDictionary = [];

            var hadMoreThanOneLiners = function(i){
                for (var j = 0; j < i; j++){
                    if (lineCountDictionary[j] >= 2) {                       
                        return true;
                    }
            }
            return false;
        }
            
            for (var key in d.data) {
                if (d.data[key] != "" && d.data[key] != null && d.data[key].length != 0){
                    i = i + 1;
                    
                    var tooltipRow = tooltipDetails.append("g")
                    // text formatting
                        .attr("transform", function(){
                            if //check if there has been a multiliner in headline
                            (hadMoreThanOneLiners(i) == true && i - 1 == 1){ 
                                //console.log( key + " headline was twoliner")
                                return "translate(0, " + ((((i-1) * 20 ) + (10 * lineCountDictionary[i-2]))) + ")"} 
                            else if //previous one more than one line and two line headline
                                (lineCountDictionary[0] > 1 && lineCountDictionary[i-2] > 1){ 
                                    //console.log( key + " previous had more lines and two line headline")
                                    return "translate(0, " + ((((i-1) * 20 ) + (20 * lineCountDictionary[i-2]))) + ")"
                                } else if //check if there has been a multiliner and headline two liner
                            (hadMoreThanOneLiners(i) == true && lineCountDictionary[0] > 1){ 
                                //console.log( key + " any line before was Moreliner and twoline headline")
                                return "translate(0, " + ((((i-1) * 20 ) + (10 * (Math.max(...lineCountDictionary))))) + ")" 

                            } else if //previous one more than one line
                            (lineCountDictionary[i-2] > 1){ 
                                //console.log( key + " previous had more lines")
                                return "translate(0, " + ((((i-1) * 20 ) + (13 * lineCountDictionary[i-2]))) + ")" 
                            } else if //check if there has been a multiliner
                            (hadMoreThanOneLiners(i) == true){ 
                                //console.log( key + " any line before was Moreliner")
                                return "translate(0, " + ((((i-1) * 20 ) + (13 * (Math.max(...lineCountDictionary))))) + ")"
                            } else if //not the headline and no multliners
                            (i - 1 != 0) { 
                               //console.log( key + " simple")
                               return "translate(0, " + (((i-1) * 20)) + ")"  
                            }
                        
                        })
                        ;
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
                                        return "18px";
                                    }else {
                                        return "15px";
                                    }
                                })
                                .attr("fill", function() {
                                    if (key == "name"){
                                        return colorRingFunction(d.ringIndex);
                                    }})
                                .style("font-weight", function(){
                                    if (key == "name"){
                                        return "600";
                                    
                                }})
                                .text(function(){
                                        if (key == "Kooperationspartner"){
                                            return key + ": " + d.data[key]   
                                        }
                                        return d.data[key]               
                                })
                                .each(function(d){
                                    linesCount = wrap(this, 250, 0)
                                    //console.log( key + linesCount)
                                    lineCountDictionary.push(linesCount);
                                })
                }
            
            }   
        })
    ;

 
    // Invisible arc to prevent text on standing overhead
    gs.selectAll("hiddenPath")
        .data(function(d,i) {       
            return pie(d).map(function(e){e.ringIndex = i; return e});
        })
        .enter()
        .append("path")
        .attr("class", "textArc")
        .attr("id", function(d,i) { 
            return d.data.name + "textArc_"+i; 
        })
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

    var lineNumber;
        
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
                    {return "#" + d.data.name + "textArc_"+i} 
                else{
                    return "#" + d.data.name + "nameArc_"+i+i;   }
                ;
        })
            .style("text-anchor", function(d, i){
                if (d.ringIndex > 1) {
                   return "middle"; 
                }   
                else {
                    return "start";
                }})
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
                if(d.ringIndex > 1){return '14px'} else {
                    return '9px';
                }})
                
            
        .each(function(d) {
            var lineNo = wrap(this, 150, d.ringIndex);
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
        })
        .attr("transform", function(d){
            if (d.ringIndex == 1){
              "rotate(-90)"   
            }
        })
    
    // middle text
    gs.append("text")
        .attr("text-anchor", "middle")
        .attr('font-size', '0.8em')
        .attr('font-family', 'arial')
        .style('fill', 'white')
        .text("Human-Centered Complex Systems")
        .each(function(d){ 
            lineCount = wrap(this, 100, 0)
        })
})




