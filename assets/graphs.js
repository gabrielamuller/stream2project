
    queue()
        .defer(d3.csv, "data/mass_shootings.csv")
        .await(makeGraphs);

    function makeGraphs(error, shootingsData) {
        var ndx = crossfilter(shootingsData);
        
        var parseDate = d3.time.format("%m/%d/%Y").parse;
        shootingsData.forEach(function(d){
            d.date = parseDate(d.date);
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
        
        var gender_dim = ndx.dimension(dc.pluck('Mental_health_issues'));
        var count_by_gender = gender_dim.group();
        
        dc.barChart("#chart1")
            .height(300)
            .width(400)
            .margins({top: 10, right: 50, bottom: 30, left: 50})
            .dimension(gender_dim)
            .group(count_by_gender)
            .transitionDuration(500)
            .x(d3.scale.ordinal())
            .xUnits(dc.units.ordinal)
            .xAxisLabel("Mental Health Issues")
            .yAxis().ticks(4);
            
       var gender_dim = ndx.dimension(dc.pluck('Race'));
       var count_by_gender = gender_dim.group();
        dc.pieChart('#chart2')
            .height(330)
            .radius(90)
            .transitionDuration(1500)
            .dimension(gender_dim)
            .group(count_by_gender)
            .legend(dc.legend().x(0).y(0).gap(5));
            
        var gender_dim = ndx.dimension(dc.pluck('Gender'));
        var count_by_gender = gender_dim.group();
        
        dc.barChart("#chart3")
            .height(300)
            .width(400)
            .margins({top: 10, right: 50, bottom: 30, left: 50})
            .dimension(gender_dim)
            .group(count_by_gender)
            .transitionDuration(500)
            .x(d3.scale.ordinal())
            .xUnits(dc.units.ordinal)
            .xAxisLabel("Gender")
            .yAxis().ticks(4);
            
        var date_dim = ndx.dimension(dc.pluck("date"));
        var total_spend_per_date = date_dim.group().reduceSum(dc.pluck("Total_victims"));
        
        var minDate = date_dim.bottom(1)[0].date;
        var maxDate = date_dim.top(1)[0].date;
        
        dc.lineChart("#chart4")
            .width(1000)
            .height(400)
            .margins({top: 10, right: 50, bottom: 30, left: 50})
            .dimension(date_dim)
            .group(total_spend_per_date)
            .transitionDuration(500)
            .x(d3.time.scale().domain([minDate,maxDate]))
            .xAxisLabel("Date")
            .yAxis().ticks(4);
     
        dc.renderAll();

    }
    
 function animateValue(id, start, end, duration) {
    // assumes integer values for start and end
    
    var obj = document.getElementById(id);
    var range = end - start;
    // no timer shorter than 50ms (not really visible any way)
    var minTimer = 50;
    // calc step time to show all interediate values
    var stepTime = Math.abs(Math.floor(duration / range));
    
    // never go below minTimer
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

animateValue("value", 100, 320, 2000);



 