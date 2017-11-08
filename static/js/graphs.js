
    queue()
        //.defer(d3.csv, "data/mass_shootings2.csv")
        .defer(d3.json, "/data")
        .defer(d3.json, "/static/us-states.json")
        .await(makeGraphs);

    function makeGraphs(error, shootingsData, statesJson) {
        console.log(shootingsData);
        
        var ndx = crossfilter(shootingsData);
        
        var parseDate = d3.time.format("%m/%d/%Y").parse;
        shootingsData.forEach(function(d){
            d.date = parseDate(d.date);
            d.year = d.date.getFullYear();
        });
        
        shootingsData.forEach(function(d) {
            
            if (d.Gender == "F" || d.Gender == "Female" || d.Gender == "female" || d.Gender == "f") {
               d.Gender = "Female";
           }
           else if (d.Gender == "M" || d.Gender == "Male" || d.Gender == "male" || d.Gender == "m") {
               d.Gender = "Male";
           }
           else if (d.Gender == "Unknown") {
               d.Gender = "Unknown"
           }
         
           else (d.Gender ="Other");
           
        });
        
         shootingsData.forEach(function(d) {
           if (d.Mental_health_issues == "Yes") {
               d.Mental_health_issues = "Yes";
           }
           else if (d.Mental_health_issues == "No") {
               d.Mental_health_issues = "No";
           }
           else (d.Mental_health_issues = "Unknown");
          
        });
        
          shootingsData.forEach(function(d) {
           if (d.Race == "White American or European American" || d.Race == "white" || d.Race == "White" || d.Race == "White American or European American/Some other Race") {
               d.Race = "White";
           }
           else if (d.Race == "Black American or African American" || d.Race == "Black" || d.Race == "black" || d.Race == "Black American or African American/Unknown") {
               d.Race = "Black";
           }
           else if (d.Race == "Asian American" || d.Race == "Asian" || d.Race == "Asian American/Some other race") {
                d.Race = "Asian"
           }
           else if (d.Race == "Latino") {
                d.Race = "Latino"
           }
           else if (d.Race == "Native American or Alaska Native") {
                d.Race = "Native American"
           }
           else (d.Race = "Unknown")
        });
        
      var stateDim = ndx.dimension(dc.pluck('Location'));
        var group = stateDim.group();
        var usamap = dc.geoChoroplethChart("#usa-map");
        
         usamap.width(600)
            .height(330)
            .dimension(stateDim)
            .group(group)
            .colors(["#E2F2FF", "#C4E4FF", "#9ED2FF", "#81C5FF", "#6BBAFF", "#51AEFF", "#36A2FF", "#1E96FF", "#0089FF", "#7C151D"])
            .colorDomain([0, 40])
            .overlayGeoJson(statesJson["features"], "state", function (d) {
                return d.properties.name;
            })
            .projection(d3.geo.albersUsa()
                .scale(600)
                .translate([340, 150]))
            .title(function (p) {
                return "State: " + p["key"]
                    + "\n"
                    + "Total Shootings: " + Math.round(p["value"]);
            });
        
        var mental_dim = ndx.dimension(dc.pluck('Mental_health_issues'));
        var count_by_mental = mental_dim.group();
        
        
        dc.barChart("#chart1")
            .height(250)
            .width(350)
            .margins({top: 10, right: 50, bottom: 30, left: 50})
            .dimension(mental_dim)
            .group(count_by_mental)
            .transitionDuration(500)
            .x(d3.scale.ordinal())
            .xUnits(dc.units.ordinal)
            .xAxisLabel("Mental Health Issues")
            .yAxis().ticks(4);
            
       var race_dim = ndx.dimension(dc.pluck('Race'));
       var count_by_race = race_dim.group();
       var colorScale = d3.scale.ordinal().range(["#7C151D", "#0089FF", "#FB8D47", "#E2F2FF", "#9ED2FF", "#6BBAFF"]);
        dc.pieChart('#chart2')
            .height(330)
            .radius(90)
            .transitionDuration(1500)
            .dimension(race_dim)
            .group(count_by_race)
            .legend(dc.legend().x(0).y(0).gap(0))
            .colors(colorScale);
            
            
        var gender_dim = ndx.dimension(dc.pluck('Gender'));
        var count_by_gender = gender_dim.group();
        
        dc.barChart("#chart3")
            .height(250)
            .width(350)
            .margins({top: 10, right: 50, bottom: 30, left: 50})
            .dimension(gender_dim)
            .group(count_by_gender)
            .transitionDuration(500)
            .x(d3.scale.ordinal())
            .xUnits(dc.units.ordinal)
            .xAxisLabel("Gender")
            .yAxis().ticks(4);
            
        var date_dim = ndx.dimension(dc.pluck("date"));
        var year_dim = ndx.dimension(dc.pluck("year"));
        var total_victims_per_date = date_dim.group().reduceSum(dc.pluck("Total_victims"));
        var total_victims_per_year = year_dim.group().reduceSum(dc.pluck("Total_victims"));

        
        var minDate = date_dim.bottom(1)[0].date;
        var maxDate = date_dim.top(1)[0].date;

        
        dc.lineChart("#chart4")
            .width(1000)
            .height(400)
            .margins({top: 10, right: 50, bottom: 30, left: 50})
            .dimension(year_dim)
            .group(total_victims_per_year)
            .transitionDuration(500)
            .x(d3.scale.linear().domain([1966,2017]))
            .brushOn(false)
            lineChart.xAxis().tickFormat(d3.format('d'));
             //.x(d3.time.scale().domain([minDate,maxDate]))
            //.y(d3.scale.log().domain([1, 600]))
            //.yAxis().tickFormat(d3.format(",.0f")).ticks(4);
            //.yAxis().ticks(4);
            //.xAxisLabel("Date")
     
        dc.renderAll();

    }
    
 function animateValue(id, start, end, duration) {
    // assumes integer values for start and end
    
    var obj = document.getElementById(id);
    var range = end - start;
   
    var minTimer = 50;
    // calc step time to show all interediate values
    var stepTime = Math.abs(Math.floor(duration / range));
    
    
    stepTime = Math.max(stepTime, minTimer);
    
    // get current time and calculate desired end time
    var startTime = new Date().getTime();
    var endTime = startTime + duration;
    var timer;
  
    function run() {
        var now = new Date().getTime();
        var remaining = Math.max((endTime - now) / duration, 0);
        var value = Math.round(end - (remaining * range));
        obj.innerHTML = value;
        if (value == end) {
            clearInterval(timer);
        }
    }
    
    timer = setInterval(run, stepTime);
    run();
}

animateValue("value", 100, 323, 2000);

function animateValue(id, start, end, duration) {
    // assumes integer values for start and end
    
    var obj = document.getElementById(id);
    var range = end - start;
   
    var minTimer = 50;
    // calc step time to show all interediate values
    var stepTime = Math.abs(Math.floor(duration / range));
    
    
    stepTime = Math.max(stepTime, minTimer);
    
    // get current time and calculate desired end time
    var startTime = new Date().getTime();
    var endTime = startTime + duration;
    var timer;
  
    function run() {
        var now = new Date().getTime();
        var remaining = Math.max((endTime - now) / duration, 0);
        var value = Math.round(end - (remaining * range));
        obj.innerHTML = value;
        if (value == end) {
            clearInterval(timer);
        }
    }
    
    timer = setInterval(run, stepTime);
    run();
}

animateValue("value2", 100, 1432, 2000);



 