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
   
var pie = d3.pie()
    .value(function(d){return 1}); 


/* 
-----------------Font-size settings-----------------
use if-case for font-size unaffected by itemcount per ring, 
use switch-case to decrease font-size automatically when changing the json file
px-Change determines by how much the font decreased per item added (item added * pxChange)
*/

//set Font-sizes
var innerRingtxt_size = 9;
var outerRingstxt_size = 13;

//single ring-fontsizes saved in array
var newTextFonts = [];
var maxItems = 13;
var pxChange = 0.25;


var fontSizeSettings = function(d){
    // ring 2-6 same size - unaffected by itemamount
    // Comment out to use ring-specific font-sizes 
    if(d.ringIndex > 1){
        return outerRingstxt_size + "px"
    } else {
        return innerRingtxt_size + "px";
    }

    //Item number amtters
    //if itemamount increases over maxItems items, decreases font-size for specific circle 
    switch(d.ringIndex){
        case 1:
            return newTextFonts[1];
        case 2:
            return newTextFonts[2];
        case 3:
            return newTextFonts[3];
        case 4:
            return newTextFonts[4];
        case 5:
            return newTextFonts[5];
        case 6:
            return newTextFonts[6];    
    }

}

/* ---------------------Language-Settings----------------------------*/

var dataFile = "./data/unidata.json";
/* In case some textfield are very long, a new key-value pair should be added below: "Langertext": ".", otherwise
the next line will overlap with the long text-block */

// change this variableaccording to data-language;  = "deutsch" , = "english"
// otherwise the legend won't change
var language = "deutsch";

var ringsEnglish = ["Professorships", "Focus", "BA/MA degree courses", "Intramural coopertaions", "non-university cooperations", "Projects", "Show all", "Hide all"]

var rings = ["Professuren", "Schwerpunkte", "Studiengänge", "Inneruniversitäre Kooperationen", 
"Außeruniversitäre Kooperationen", "Projekte", "Alle anzeigen", "Alle verbergen"];


 /*--------------------------Colors------------------------------ */ 

var colorLeitsatz = '#3b515b';
colorProfessuren = '#5EADBF',
colorSchwerpunkte = '#BF8888',
colorStudiengaenge = '#D96B62',
colorInKoop = '#F25041',
colorAuKoop = '#e2001a',
colorProjekte = '#c90018';

var ringColorLegendFunction = function(ring){
    switch (ring) {
        case "Professuren":
        case "Professorships":
            return colorProfessuren;
        case "Schwerpunkte":
        case "Focus":
            return colorSchwerpunkte;
        case "Studiengänge":
        case "BA/MA degree courses":
            return colorStudiengaenge;
        case "Inneruniversitäre Kooperationen":
        case "Intramural coopertaions":
            return colorInKoop;
        case "Außeruniversitäre Kooperationen":
        case "non-university cooperations":
            return colorAuKoop;
        case "Projekte":
        case "Projects":
            return colorProjekte;
        } 
};

 // set COLORs for each ring
var colorRingFunction = function(i){
    switch (i) {
        case 0:
            return colorLeitsatz;
        case 1:
            return colorProfessuren;
        case 2:
            return colorSchwerpunkte;
        case 3:
            return colorStudiengaenge;
        case 4:
            return colorInKoop;
        case 5:
            return colorAuKoop;
        case 6:
            return colorProjekte;
        } 
};


/* ---------------DATA LOADING & the graph----------------------- 
switch filepath to english jason file to display all the names in english */
//load data
d3.json(dataFile).then(function(data){ 
  
    var arc = d3.arc();

    var gs = svg.selectAll("g")
                .data(d3.values(data))
                .enter()
                .append("g")
                .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

/* ----------Tooltip for readibility and abbreviations/ extra Information ------- */
    // init tooltip
    var tip = d3.tip()
                .attr('class', 'd3-tip')
                .html(function(d) {
                    var text = "<strong> <span style='color:white'>" + d.data.name + "</strong></span><br>";
                    if (d.ringIndex == 1){
                      text +=  "<font size= 2>" + d.data.profname + "<br>" + "<br>"
                    }
                    if (d.ringIndex == 3){
                        text +=  "<font size= 2>" + d.data.Studienabschluss + "<br>" + "<br>"
                      }
                    if (d.ringIndex == 4 || d.ringIndex == 5){
                        if (d.data.more != ""){
                            text +=  "<font size= 2>" + d.data.more + "<br>" + "<br>"
                        }
                    }
                    text += "<font size= 2>" + "Anklicken für mehr Info" + "</font>";                  
                    return text;
                })
                .direction('e')
;

    // call tooltip
    gs.call(tip);

/* ---------------legend & ring-filter-function---------------- */

    var legend = svg.append("g")
                    .attr("transform", "translate(" + (width - 1545) + 
                        "," + (height - 1425) + ")");

    var linesLegendCount;

    function displayLegend(ring, i){
        
        var legendRow = legend.append("g")
            .attr("transform", "translate(" + 0 + " ," + (i * 40) + ")")

        legendRow.append("text")
            .attr("name", function(d) {
            return ring;
            })
            .attr("class", "legend")
            .attr("text-anchor", "start")
            .attr("dx", function(){
                if (ring == "Alle anzeigen" || ring == "Alle verbergen" || ring == "Show all" || ring == "Hide all"){
                    return "-38";
                }
            })
            .attr("dy", function(){
                if (ring == "Alle verbergen" || ring == "Hide all" ){
                    return "-12";
                }
            })
            .style("font-size", function (){
                if (ring == "Alle anzeigen" || ring == "Alle verbergen" || ring == "Show all" || ring == "Hide all"){
                    return "13px"
                } 
                    return "15px"
            })
            .style("font-weight", function (){
                if (ring == "Alle anzeigen" || ring == "Alle verbergen" || ring == "Show all" || ring == "Hide all"){
                    return "bold"}
            })
            .on("click", function(){

                var current = d3.select(this).attr("name")
                if (language == "deutsch"){
                   var currentRingindex = rings.indexOf(current) + 1 
                } else {
                    var currentRingindex = ringsEnglish.indexOf(current) + 1 
                }
                var setOpacity = 0.2;

                console.log(current)
                console.log(currentRingindex)
                
                //show all
                if (d3.select(this).attr("name") == "Alle anzeigen" || d3.select(this).attr("name") == "Show all"){
                    d3.selectAll("path").style("opacity", 1);
                    d3.selectAll(".nameText").style('opacity', 1);
                    d3.selectAll(".legend").style("opacity", 1);
                    d3.selectAll(".legendRect").style("opacity", 1); 
                }

                //hide all
                if (d3.select(this).attr("name") == "Alle verbergen" || d3.select(this).attr("name") == "Hide all"){
                    
                    // hiode all but the inner most ring
                    d3.selectAll("path").filter(function(d){
                        var fadedRing = d3.select(this).attr("ringindex") > 0;
                        return fadedRing
                    }).style("opacity", setOpacity);

                    d3.selectAll(".nameText").style('opacity', setOpacity);

                    d3.selectAll(".legend").filter(function(d){
                        var fadedLegend = d3.select(this).attr("name") != "Alle anzeigen" || d3.select(this).attr("name") != "Show all";
                        return fadedLegend
                    }).style("opacity", 0.5);

                    d3.selectAll(".legendRect").style("opacity", 0.5); 
                }

                // blend out the circles
                if (d3.select(this).attr("name") == current && (d3.select(this).attr("name") != "Alle anzeigen" || d3.select(this).attr("name") != "Show all")
                && (d3.select(this).attr("name") != "Alle verbergen" || d3.select(this).attr("name") != "Hide all")){
                    
                    d3.selectAll("path").filter(function(d) {
                        var fadedRing = d3.select(this).attr("ringindex") == currentRingindex;
                        return fadedRing;
                    }).style("opacity", function(d) {
                        if (d3.select(this).style("opacity") == 1) {
                            return setOpacity
                        } else {
                            return 1
                        }
                    });
                    
                    d3.selectAll(".nameText").filter(function(d){
                        var fadedText = d.ringIndex == currentRingindex
                        return fadedText;
                    }).style('opacity', function(d) {
                        if (d3.select(this).style("opacity") == 1) {
                            return setOpacity
                        } else {
                            return 1
                        }});

                    d3.select(this).style("opacity", function(){
                        if (d3.select(this).style("opacity") == 1 && d3.select(this).attr("name") == current) 
                        {
                            return 0.5
                        } 
                        else {
                            return 1
                        }})

                    d3.selectAll(".legendRect").filter(function(d){
                        var fadedRects = d3.select(this).attr("rectname") == current
                        return fadedRects;
                    }).style('opacity', function(d) {
                        if (d3.select(this).style("opacity") == 1) {
                            return setOpacity
                        } else {
                            return 1
                        }});
                };
                
                
            })
            .on("mouseover", function(d){
                d3.select(this).style("cursor", "pointer")
            })
            .on("mouseout", function(d){
                d3.select(this).style("cursor", "default")
            })
            .text(ring)
            .each(function(d){ 
                linesLegendCount = wrap(this, 150, 0)
            })
            .attr("y", function(){
                if (linesLegendCount == 2){
                    return 8;
                }  
                return 16;
            })
            ;

        legendRow.append("rect")
            .attr("class", "legendRect")
            .attr("x", -38)
            .attr("rectname", ring)
            .attr("width", 22)
            .attr("height", 22)
            .attr("fill", function(){
               if (ring != "Alle anzeigen" && ring != "Alle verbergen" && ring != "Show all" && ring != "Hide all"){
                return ringColorLegendFunction(ring)
               } else { 
                   return "None"
                } 
            })
            .on("mouseover", function(d){
                d3.select(this).style("cursor", "pointer")
            })
            .on("mouseout", function(d){
                d3.select(this).style("cursor", "default")
            })
            .on("click", function(){

                var current = d3.select(this).attr("rectname")
                if (language == "deutsch"){
                    var currentRingindex = rings.indexOf(current) + 1 
                } else {
                     var currentRingindex = ringsEnglish.indexOf(current) + 1 
                }
                var setOpacity = 0.2;

                // blend out the circles
                if (d3.select(this).attr("rectname") == current){
                    //console.log(d3.select(this).attr("rectname"))
                    d3.selectAll("path").filter(function(d) {
                        var fadedRing = d3.select(this).attr("ringindex") == currentRingindex;
                        return fadedRing;
                    }).style("opacity", function(d) {
                        if (d3.select(this).style("opacity") == 1) {
                            return setOpacity
                        } else {
                            return 1
                        }
                    });
                    
                    d3.selectAll(".nameText").filter(function(d){
                        var fadedText = d.ringIndex == currentRingindex
                        return fadedText;
                    }).style('opacity', function(d) {
                        if (d3.select(this).style("opacity") == 1) {
                            return setOpacity
                        } else {
                            return 1
                        }});

                    d3.select(this).style("opacity", function(){
                        if (d3.select(this).style("opacity") == 1 && d3.select(this).attr("rectname") == current) {
                            return 0.5
                        } 
                        else {
                            return 1
                        }
                    })

                    d3.selectAll(".legend").filter(function(d){
                        var fadedRects = d3.select(this).attr("name") == current
                        return fadedRects;
                    }).style('opacity', function(d) {
                        if (d3.select(this).style("opacity") == 1) {
                            return setOpacity
                        } else {
                            return 1
                        }});
                };
                
                
            }) 
    

    }
    
    if (language == "deutsch"){
        rings.forEach(function(ring, i){
            displayLegend(ring, i);
        });  
    } else {
        ringsEnglish.forEach(function(ring, i){ 
            displayLegend(ring, i);
        }); 
    }

/* ------------------------------------------ */

    //itemdetails init
    var tooltipDetails = svg.append("g")
                            .attr("transform", "translate(" + (width - 560) + 
                            "," + (height - 1420) + ")")
                            .attr('id', 'details')
    ;
    var imgDistance = 20;
    var linkDistance = 15;     
    
    // prevents itemdetails to stack
    function removeItemDetails(){
    d3.select("#details").selectAll("#text").remove();
    d3.select("#details").selectAll("a").remove();
    d3.select("#details").selectAll("image").remove();
    }

    // clicking on an arc/ text resets it bak to normal state
    function resetToNormal(){
        d3.select("#details").selectAll("#text").remove();
        d3.select("#details").selectAll("a").remove();
        d3.select("#details").selectAll("image").remove();
        d3.selectAll("path").style('opacity', 1)
        d3.selectAll(".nameText").style('opacity', 1)
        d3.selectAll(".nameText").style('font-weight', "normal")
    }
                            
/* --------------------- the graph ------------------*/

    // dictionary is used to store the center point of all the visible arcs so it can be used later to create hidden ones 
    // formula is : (innerRadius + outerRadius) / 2
    var arcIndexDictionary = {};
    var arcRingIndexSizeDictionary = [];
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
                var innerRadiusSlim = (cwidth * d.ringIndex) + 2 *cwidth;
                var outerRadiusSlim = cwidth * (d.ringIndex + 1) + 2 * cwidth;
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
        .attr("fb_professuren", function(d) {
            return d.data.Forschungsbereichsprofessuren
            })
        .attr("ringindex", function(d) {
                return d.ringIndex
                })
        .on("mouseover", function(d){    
            d3.select(this).style("cursor", "pointer")
            return tip.show(d, this)
        })
        .on("mouseout", function(d){
            d3.select(this).style("cursor", "default")
            return tip.hide(d, this)
        })
        //interaction highlight connections/ cooperations + show details
        .on('click', function(d) {
            var current = d3.select(this).attr("name");
            var coops = d3.select(this).attr("coop"); 
            var fb_profs = d3.select(this).attr("fb_professuren")

            // make current textnode bold to differentiate it from cooperations
            d3.selectAll(".nameText").filter(function(d){
                return d.data.name == current
            }).style("font-weight", "bold")
            d3.selectAll(".nameText").filter(function(d){
                return d.data.name != current
            }).style("font-weight", "normal")
                            
            // remove itemdetails and reset to normal
            if (d3.select(this).style('opacity') == 0.99){
                return resetToNormal();
            } 
                        
            // filter, change opa of the items that are not selected
            if (d3.select(this).style('opacity') == 0.3 || d3.select(this).style('opacity') == 1) {
                d3.selectAll("path").style('opacity', 0.99)
                    .filter(function(d) {
                        if (coops != null){   // if there arent coops it mfades everything, otheriwse not clickable and typeerror
                            var fadedArcs = d3.select(this).attr("name") != current &&
                            coops.includes(d3.select(this).attr("name")) == false;
                            return fadedArcs; 
                        } else if (fb_profs != null){
                            var fadedArcs = d3.select(this).attr("name") != current &&
                            fb_profs.includes(d3.select(this).attr("name")) == false;
                            return fadedArcs; 
                        } else { 
                            var fadedArcs = d3.select(this).attr("name") != current;
                            //console.log("No cooperations or fb_profs found");
                            return fadedArcs;
                        };
                    })
                    .style('opacity', 0.3)
                ;  

                d3.selectAll(".nameText")
                    .style('opacity', 0.99)
                    .filter(function(d){
                    if (coops != null){
                        var fadedArcs = coops.includes(d.data.name) == false && (d.data.name != current)
                        return fadedArcs;
                    } else if (fb_profs != null){
                        var fadedArcs = fb_profs.includes(d.data.name) == false && (d.data.name != current)
                        return fadedArcs; 
                    } else {
                        return d.data.name != current;
                    }
                    })
                    .style('opacity', 0.3) 
            } 

            removeItemDetails();



/* ----------- ARC click-event : Text-formatting Itemdetails ----- */
            var i = 0;
            var linesCount;
            var totalLinesCount = 0;

            // print each the content of each data-entry-key below each other
            function formatItemDetails(){for (var key in d.data) {
                if (d.data[key] != "" && d.data[key] != null && d.data[key].length != 0){
                    i = i + 1;
                    var tooltipRow = tooltipDetails.append("g")           
                    .attr("transform", function(){
                        if ( key == "link"){
                            return "translate(0, " + ((((i-1) * 20 ) + linkDistance + (11 * totalLinesCount))) + ")"
                        }else{
                            return "translate(0, " + ((((i-1) * 20 ) + (11 * totalLinesCount))) + ")"  
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
                        
                    if (key == "link"){
                        //console.log(d.data[key])
                        var url = d.data[key]
                        tooltipRow.append("a")
                            .attr("xlink:href", function(d){return url;})
                            .append("text")
                            .text(function(d) {return url;})
                            .style("font-size", "15px")  
                            .style("fill", "blue")
                        } else if (key == "bild"){
                            var filepath = d.data[key]
                            tooltipRow.append("image")
                            .attr('width', 200)
                            .attr('y', imgDistance)
                            .attr("xlink:href", filepath)
                            console.log(filepath) 
                        } else {   
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
                                    }
                                })
                                .text(function(){
                                    if (key == "Kooperationspartner" || key == "Forschungsbereichsprofessuren" || key == "Budget"){
                                        if (language == "deutsch"){
                                            return key + ": " + d.data[key] 
                                        } else {
                                            if (key == "Kooperationspartner"){
                                                return "Cooperations: " + d.data[key]; 
                                            } else if (key == "Forschungsbereichsprofessuren"){
                                                return "Professorships: " + d.data[key];
                                            }
                                        } 
                                    }
                                    return d.data[key]               
                                })
                                .each(function(d){
                                    linesCount = wrap(this, 240, 0)
                                    console.log( key + linesCount)
                                    totalLinesCount = totalLinesCount + linesCount;
                                    console.log(totalLinesCount)
                                })
                        }      
                }   
            } 
            }

            formatItemDetails();  
    });


 /* ------------ formatting text-labels on arc ---- */

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
                    } else
                        return newHiddenArc;
                } else
                    return newHiddenArc;
            }
        )
        .attr("fill", "none");

     
    /* ------------- Arclabel-Text ---------*/
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
                else {
                    return "#" + d.data.name + "nameArc_"+i+i;
                };
        })
        .style("text-anchor", function(d, i){
            var ringItemCount = arcRingIndexSizeDictionary[d.ringIndex];    
	        if(d.ringIndex == 1 && i <= ringItemCount/2)
	            return "start"; 
            if (d.ringIndex > 1) {
                return "middle"; 
            } else {
                return "start";
            }
        })
        .attr("startOffset", function(d, i){ 
            if(d.ringIndex == 1 && i <= ringItemCount/2) 
	            return "50%"; 
            if(d.ringIndex == 1) 
                return "12%";   
            var ringItemCount = arcRingIndexSizeDictionary[d.ringIndex];
            if(i > ringItemCount/4 && i < ringItemCount * 3/4)
                return "17%"; 
            return "25%";
        })      
        .attr("textName", function(d) {
            return d.data.name
        })
        .attr("textCoop", function(d) {
            return d.data.Kooperationspartner
        })
        .attr("text_fb_profs", function(d) {
            return d.data.Forschungsbereichsprofessuren
        })
        .text(function(d, i, array){ 
            if (d.ringIndex > 0){
                return d.data.name
            };
        })
        .style('font-family', 'arial')
        .attr('font-size', function(d){
            return fontSizeSettings(d);
        })
        .each(function(d) {
            if (d.ringIndex == 1){
                var lineNo = wrap(this, 100, d.ringIndex); // doesnt do anything
            }
            var lineNo = wrap(this, 160, d.ringIndex);
            arcLineCountDictionary[d.data.name] = lineNo;
        })
        .on("mouseover", function(d){    
            d3.select(this).style("cursor", "pointer")
            return tip.show(d, this)
            })
        .on("mouseout", function(d){
            d3.select(this).style("cursor", "default")
            return tip.hide(d, this)
            }) 
        .on("click", function(d){
            var current = d3.select(this).attr("textName");
            var coops = d3.select(this).attr("textCoop");
            var fb_profs = d3.select(this).attr("text_fb_profs");
       
            //reset to normal 
            if (d3.select(this).style("font-weight") == 700){ 
                return resetToNormal();
            }

            // Highlight connected items
            else if (d3.select(this).style("font-weight") == 400) { 
                d3.selectAll("path").style("opacity", 0.99)
                    .filter(function(d) {
                        if (coops != null){  
                            var fadedArcs = d3.select(this).attr("name") != current &&
                            coops.includes(d3.select(this).attr("name")) == false;                          
                            return fadedArcs; 
                        } else if (fb_profs != null){
                            var fadedArcs = d3.select(this).attr("name") != current &&
                            fb_profs.includes(d3.select(this).attr("name")) == false;                          
                            return fadedArcs; 
                        } else { 
                            var fadedArcs = d3.select(this).attr("name") != current;
                            return fadedArcs;
                        };
                    })
                .style('opacity', 0.3);

                d3.selectAll(".nameText").style("opacity", 0.99)
                .filter(function(d){
                    if (coops != null){ 
                        var fadedArcs = coops.includes(d.data.name) == false && (d.data.name != current)
                        return fadedArcs
                    } else if (fb_profs != null){
                            var fadedArcs = (d.data.name != current) && fb_profs.includes(d.data.name) == false;                          
                            return fadedArcs; 
                    } else {
                        return d.data.name != current
                    }
                }).style('opacity', 0.3)
            }

        d3.selectAll(".nameText").filter(function(d){
            return d.data.name == current
        }).style("font-weight", "bold")
        d3.selectAll(".nameText").filter(function(d){
            return d.data.name != current
        }).style("font-weight", "normal")

        removeItemDetails();
        
/* ----------------TEXT clicked event: formatting Itemdetails Text ----------*/

        var i = 0;
        var linesCount;
        var totalLinesCount = 0;

        function formatItemDetails(){   
            if (key == "link"){
                //console.log(d.data[key])
                var url = d.data[key]
                tooltipRow.append("a")
                    .attr("xlink:href", function(d){return url;})
                    .append("text")
                    .text(function(d) {return url;})
                    .style("font-size", "15px")
                    .style("fill", "blue")
            } else if (key == "bild"){
                var filepath = d.data[key]
                tooltipRow.append("image")
                    .attr('width', 200)
                    .attr('y', imgDistance)
                    .attr("xlink:href", filepath)
                    //console.log(filepath)
            } else {
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
                            }
                    })
                    .style("font-weight", function(){
                        if (key == "name"){
                            return "600";   
                        }
                    })
                    .text(function(){
                        if (key == "Kooperationspartner" || key == "Forschungsbereichsprofessuren"){
                            if (language == "deutsch"){
                                return key + ": " + d.data[key] 
                            } else {
                                if (key == "Kooperationspartner"){
                                    return "Cooperations: " + d.data[key]; 
                                } else if (key == "Forschungsbereichsprofessuren"){
                                    return "Professorships: " + d.data[key];
                                }
                            }
                            
                        }
                        return d.data[key]               
                    })
                    .each(function(d){
                        linesCount = wrap(this, 240, 0)
                        totalLinesCount = totalLinesCount + linesCount;
                    })
        }}

        for (var key in d.data) {
            if (d.data[key] != "" && d.data[key] != null && d.data[key].length != 0){
                i = i + 1;
                var tooltipRow = tooltipDetails.append("g")
                // text formatting text clicked
                .attr("transform", function(){ 
                    if ( key == "link"){
                        return "translate(0, " + ((((i-1) * 20 ) + linkDistance + (11 * totalLinesCount))) + ")"
                    }else{
                        return "translate(0, " + ((((i-1) * 20 ) + (11 * totalLinesCount))) + ")"  
                    }
                });

                tooltipRow.append("text")
                    .attr("id", "text")
                    .attr("x", -20)
                    .attr("y", 15)
                    .attr("text-anchor", "start")
                    .style("font-size", "15px")
                    .text(""); 

                formatItemDetails();
            }
        }
    }) 
    
/*----------------- Text-Arc- formatting functions------------- */
    // text wrap function
    function wrap(text2, width, ringIndex) {
        var text = d3.select(text2),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineconstant = 0,
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
                            .attr("dy", ++lineconstant * lineHeight + "em")
                            .text(word)
            }
        }
        // +1 because if there are no tspans word itself is a line
        return lineconstant + 1;
    }

    // Centralize everything
    gs.selectAll("text")
        .attr('dy', function(d, i, array){
            var lineCount = arcLineCountDictionary[d.data.name];
            var ringItemCount = arcRingIndexSizeDictionary[d.ringIndex];
            // inner text ring 
            if (d.ringIndex == 1 && i <= (ringItemCount / 2)){
                    return "15"
                };
            //upper
            if(i <= ringItemCount/4 || i >= ringItemCount * 3/4){
                if(d.ringIndex > 1 && lineCount == 1){
                    return "-1";   
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
        

    // ROTATE
    d3.selectAll("text")
    .attr("transform", function(d, i) {
    if (d !== undefined) {
        var ringItemCount = arcRingIndexSizeDictionary[d.ringIndex];
        if (d.ringIndex == 1 && i <= (ringItemCount / 2) + 1) {
            var locationData = this.getBBox();
            var centerX = locationData.x + (locationData.width / 2);
            var centerY = locationData.y + (locationData.height / 2);
            var result = 'translate(' + centerX + ',' + centerY + ')';
            result += 'rotate(175)';
            //175 instead of 180 to centralize
            result += 'translate(' + (-centerX) + ',' + (-centerY) + ')';
            return result;      
        }
        //Centralize
        if (d.ringIndex == 1) {
            var result = "rotate(-6)"
            return result;
        }
    }
    })

    // Font-size calculation
    // Code for calculating the text-font-size accoring to number of items
    //calculating the font-size when number of elemnts changes in the rings
    var startItemNumbers = [0, 37, 2, 8, 12, 13, 3],
    currentRingItemCount = arcRingIndexSizeDictionary,
    arrayLength = currentRingItemCount.length,
    r1_FontSize = innerRingtxt_size,
    r2_FontSize = outerRingstxt_size,
    r3_FontSize = outerRingstxt_size,
    r4_FontSize = outerRingstxt_size,
    r5_FontSize = outerRingstxt_size,
    r6_FontSize = outerRingstxt_size;

    function decrease(ringFS){
        var newFontSize = ringFS - (itemDiff * pxChange);
        return newFontSize;
    }

    function noChange(ringFS){
        switch(ringFS){
            case 1:
                return r1_FontSize;
            case 2: 
                return r2_FontSize;
            case 3:
                return r3_FontSize;
            case 4: 
                return r4_FontSize;
            case 5:
                return r5_FontSize;
            case 6: 
                return r6_FontSize;
            }
    }

    var getFontSize = function(i){
        if (currentRingItemCount[i] < startItemNumbers[i]){
            //console.log("Items in ring" + i + " decreased")
            return noChange(i);
        } else if (currentRingItemCount[i] > startItemNumbers[i]) {
            //console.log("Items in ring" + i + " increased")
            itemDiff = currentRingItemCount[i] - startItemNumbers[i]; 
            if (currentRingItemCount[i] > maxItems){
                return nochange(i);
            } else {
                switch(i){
                    case 1:
                        r1_FontSize = decrease(r1_FontSize);
                        return r1_FontSize;
                    case 2: 
                        r2_FontSize = decrease(r2_FontSize);
                        return r2_FontSize;
                    case 3:
                        r3_FontSize = decrease(r3_FontSize);
                        return r3_FontSize;
                        break;
                    case 4: 
                        r4_FontSize = decrease(r4_FontSize);
                        return r4_FontSize;
                    case 5:
                        r5_FontSize = decrease(r5_FontSize);
                        return r5_FontSize;
                    case 6: 
                        r6_FontSize = decrease(r6_FontSize);
                        return r6_FontSize;
                }  
            }  
            
        } else if (currentRingItemCount[i] == startItemNumbers[i]){
            //console.log("Items in ring" + i + " stayed the same")
            return noChange(i);
        }
    }

    function getNewFontSizeArray(){
            newTextFonts.push(0)
            var i;
            for (i = 1; i < arrayLength; i++){
                var newFontSize = getFontSize(i);
                newTextFonts.push(newFontSize + "px");
            }       
            return newTextFonts;    
    }
    getNewFontSizeArray();
        
    
    
/* --------------- most inner circle -------*/
    // middle text
    gs.append("text")
        .attr("text-anchor", "middle")
        .attr('font-family', 'arial')
        .style('fill', 'white')
        .text("Human-Centered Complex Systems")
        .attr('font-size', '10px') 
        .each(function(d){ 
            lineCount = wrap(this, 100, 0)
        })
    ;
})




