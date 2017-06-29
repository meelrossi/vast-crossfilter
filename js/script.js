d3.csv("data.csv", function (data) {
  // All car types
  var carTypes = ['1', '2', '3', '4', '5', '6', '2P'];

  // All gate types
  var gateTypes = ["entrance", "gate", "ranger-stop", "camping", "general-gate", "ranger-base"];

  // Week days
  var weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Car type chart. Will show the amount of cars of that type
  var carTypeRingChart = dc.pieChart("#chart-ring-car");

  // Gate type charts. Will show all the gates type mention previously with the amount of cars that pass through that type of gate
  var gateTypeBarChart = dc.rowChart("#chart-hist-gate");

  // // Hour chart. Will show the amount of cars that pass on each hour
  var hourChart = dc.barChart("#chart-row-hour");
  //
  // // Date chart. Will show the amount of cars that pass on that period of time
  // var dateChart = dc.barChart("#chart-row-date");
  //
  // // Day Type chart. Will show the amount of cars depending on the day of the week
  var dayTypeChart = dc.rowChart('#chart-day');

  var dateFormat = d3.time.format('%Y-%m-%d %H:%M:%S');

  data.forEach(function (d) {
      var date = dateFormat.parse(d["Timestamp"]);
      d.date = date;
      d.hour = date.getHours();
      d.day = weekDays[date.getDay()];

      gateTypes.forEach(function (gt) {
        if (d["gate-name"].includes(gt)) {
          d.gateType = gt;
        }
      });
  });

  var gateTypeScale = d3.scale.ordinal()
                                .domain(gateTypes)
                                .range(['#5082E4', '#68BE5F', '#FF5867', '#FF794D', '#BE5FB6', '#3DCCCC']);

  var carTypeScale = d3.scale.ordinal()
                                .domain(carTypes)
                                .range(['#5082E4', '#68BE5F', '#FF5867', '#FF794D', '#BE5FB6', '#3DCCCC', '#554471']);

  var dayColorScale = d3.scale.ordinal()
                                .domain(weekDays)
                                .range(['#5082E4', '#68BE5F', '#FF5867', '#FF794D', '#BE5FB6', '#3DCCCC', '#554471']);


  var ndx = crossfilter(data),
      carDim = ndx.dimension(function (d) {return d["car-type"]}),
      gateDim = ndx.dimension(function (d) {return d.gateType;}),
      hourDim = ndx.dimension(function (d) {return d.hour;}),
      // dateDim = ndx.dimension(function (d) {return d.date;}),
      dayDim = ndx.dimension(function (d) {return d.day;}),
      carsGraph = carDim.group().reduceCount()
      gateGraph = gateDim.group().reduceCount();
      dayGraph = dayDim.group().reduceCount(),
      // dateGraph = dateDim.group().reduceCount(),
      hourGraph = hourDim.group().reduceCount(function (d) {d["car-id"]});


  carTypeRingChart
      .width(500).height(300)
      .dimension(carDim)
      .group(carsGraph)
      .innerRadius(40)
      .colors(function(d) {return carTypeScale(d)});

  hourChart
      .width(1000).height(300)
      .dimension(hourDim)
      .group(hourGraph)
      .x(d3.scale.ordinal())
      .xUnits(dc.units.ordinal)
      .elasticX(true)
      .elasticY(true)
      .colors(function(d) {return "#5082E4"});

  hourChart.xAxis().tickFormat(function(d) {return d});
  hourChart.yAxis().ticks(4);

  dayTypeChart
      .width(1000).height(300)
      .dimension(dayDim)
      .group(dayGraph)
      .x(d3.scale.ordinal())
      .elasticX(true)
      .colors(function(d) {return dayColorScale(d);});

  gateTypeBarChart
      .width(1000).height(300)
      .dimension(gateDim)
      .group(gateGraph)
      .elasticX(true)
      .colors(function(d) {return gateTypeScale(d)});

  // dateChart.width(2500)
  //     .height(300)
  //     .margins({top: 20, right: 200, bottom: 20, left: 200})
  //     .dimension(dateDim)
  //     .group(dateGraph)
  //     .centerBar(true)
  //     .colors(function(d) {return "#5082E4"})
  //     .x(d3.time.scale().domain([new Date(2015, 04, 01), new Date(2016, 05, 31)]))
  //     .round(d3.time.month.round)
  //     .alwaysUseRounding(true)
  //     .elasticX(true)
  //     .elasticY(true)
  //     .xUnits(d3.time.month);

  dc.renderAll();
})
