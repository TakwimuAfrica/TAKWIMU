/*
Pass in an options object that includes data, get back a D3 chart.

Chart({
    chartContainer: chartID, # the ID of the element where the chart should be drawn
    chartType: chartType, # `pie` or `column` (TODO: more chart types)
    chartStatType: chartStatType, # pass in `percentage` to format display of data values accordingly
    chartHeight: chartHeight, # pass in int; defaults to height of parent container or 180, whichever is greater
    chartColorScale: chartColorScale, # name of scale defined in chart.colorbrewer, defaults to 'Set2'
    chartData: chartData # an object that can be mapped, returning `name` and `value` properties
})
*/

function Chart(options) {
  var chart = {};
  var showActions = !!(window.takwimu && window.takwimu.country);

  chart.init = function(options) {
    chart.id = options.chartContainer;
    // establish our base vars
    chart.chartContainer = d3
      .select("#" + options.chartContainer)
      .style("margin", "0")
      .style("position", "relative");

    if (showActions) {
      chart.chartContainer = chart.chartContainer
        .style("width", "75%") // Since styles from wazimap column-x have -2%  in them, We reclaim that percent
        .append("div")
        .style("position", "relative")
        .style("float", "left")
        .style("width", "50%"); // Since styles from wazimap column-x have -2%  in them, We reclaim that percent

      chart.chartActions = d3
        .select("#" + options.chartContainer)
        .append("div")
        .style("float", "left")
        .style("width", "50%") // Since styles from wazimap column-x have -2%  in them, We reclaim that percent
        .classed("chart-actions", true);
      chart.chartAnalysis = chart.chartActions
        .insert("div")
        .style("padding", "0 1.938rem")
        .style("padding-top", "2.5rem")
        .classed("chart-analysis", true);

      // TODO :
      // const row = document.getElementById(options.chartContainer).parentNode;
      // const section = row.parentNode;
      // const rowIndex = Array.prototype.slice.call(
      //     section.children
      // )
      // .indexOf(row);
      //
      // chart.chartAnalysis
      //     .insert("p")
      //     .classed("title")
      //     .text(rowIndex > 0 ? "Summary" : "Related analysis")
      //     .insert("p")
      //     .classed("description")
      //     .text("Lorem ipsum dolor sit amec, the related demographic analysis for South Africa");

      chart.chartAnalysis
        .insert("a")
        .attr('href', `/profiles/${window.takwimu.country.slug}`)
        .classed("chart-analysis-read", true)
        // TODO :
        // .classed(`chart-analysis ${rowIndex > 0 && "chart-analysis--full"}`, true)
        .insert("p")
        .text("Read the country analysis");
        // TODO :
        // .text(rowIndex > 0 ? "Read the full analysis" : "Read the country analysis");
    }

    chart.screenPosition = chart.chartContainer.node().getBoundingClientRect();
    chart.parentHeight = chart.getParentHeight();
    chart.chartType = options.chartType;
    chart.chartDataKey = options.chartDataKey;
    chart.chartChartTitle = options.chartChartTitle || null;
    chart.chartChartSubtitle = options.chartChartSubtitle || null;
    chart.chartQualifier = options.chartQualifier || null;
    chart.chartRelease = options.chartRelease || null;
    chart.chartReleaseYear = options.chartReleaseYear || null;
    chart.chartSourceLink = options.chartSourceLink || null;
    chart.chartSourceTitle = options.chartSourceTitle || chart.chartSourceLink;
    chart.chartInitialSort = options.chartInitialSort || null;
    chart.chartStatType = options.chartStatType || "number";
    chart.chartNullLabel = options.chartNullLabel || "N/A";
    chart.decimalPlaces = parseInt(options.chartDecimalPlaces) || 0;
    chart.tableDecimalPlaces = parseInt(options.chartDecimalPlaces) || 1;
    chart.colorbrewer = options.colorbrewer || (window.HURUMAP_THEME && window.HURUMAP_THEME.charts.colorbrewer);
    chart.chartChartShowYAxis = options.chartChartShowYAxis || (window.HURUMAP_THEME && window.HURUMAP_THEME.charts.show_y_axis) || (chart.chartStatType == "percentage" ? true : false);
    chart.columnWidth = parseInt(options.columnWidth) || 30;          //standard width for column, grouped_column
    chart.columnOffset = parseInt(options.columnOffset) || 10;        //threshold for number of bars for adding scrolling
    chart.chartHeight =
      options.chartHeight ||
      (chart.parentHeight < 180 ? 180 : chart.parentHeight);
    chart.chartColorScale = options.chartColorScale || (window.HURUMAP_THEME && window.HURUMAP_THEME.charts.color_scale) || "Set2S";
    chart.screenPosition = document
      .getElementById(options.chartContainer)
      .getBoundingClientRect();

    // add a bit of geodata for links and hovercards
    var geographyThis = options.geographyData["this"],
      geographyParents = options.geographyData.parents;
    chart.thisGeo = geographyThis;
    chart.parentGeo = geographyParents;
    chart.comparisonLevels = options.comparisonLevels;

    chart.comparisonNames = {
      this: !!geographyThis ? geographyThis.short_name : "here"
    };
    chart.comparisonLevels.forEach(function(d) {
      chart.comparisonNames[d] = !!geographyParents[d]
        ? geographyParents[d].short_name
        : d;
    });

    chart.comparisonNamePhrases = {
      this: !!geographyThis ? "in " + geographyThis.short_name : "here"
    };
    chart.comparisonLevels.forEach(function(d) {
      chart.comparisonNamePhrases[d] = !!geographyParents[d]
        ? "in " + geographyParents[d].short_name
        : d + "-wide";
    });

    chart.primaryGeoID = geographyThis.full_geoid;
    chart.geoIDs = [geographyThis.full_geoid];
    d3.values(geographyParents).forEach(function(g) {
      chart.geoIDs.push(g.full_geoid);
    });

    var dataObj,
      metadataFields = ["metadata", "acs_release"];

    // filter out metadata objects before we prep data for chart
    chart.chartDataValues = d3.map(options.chartData);
    metadataFields.forEach(function(v) {
      chart.chartDataValues.remove(v);
    });
    if ($.isEmptyObject(chart.chartDataValues)) {
      return;
    }

    // keep the initial data for possible display later
    chart.initialData = options.chartData;
    chart.tableID =
      chart.initialData.metadata && chart.initialData.metadata.table_id;
    if (chart.tableID) chart.tableID = chart.capitalize(chart.tableID);

    chart.generateURLs();

    chart.chartDataValues = chart.chartDataValues
      .values()
      .filter(function(n) {
        return typeof n != "function";
      })
      .map(function(d) {
        if (chart.chartType.indexOf("grouped_") != -1) {
          // data shaped for grouped-column or -bar presentation
          dataObj = {
            name: d.metadata.name,
            values: []
          };
          d3.keys(d)
            .filter(function(v) {
              return chart.exclude(metadataFields, v);
            })
            .forEach(function(v, i) {
              dataObj.values.push({
                name: v,
                value: +d[v].values["this"],
                context: d[v]
              });
            });
        } else {
          // otherwise, just grab the name and value of the data point
          dataObj = {
            name: d.name,
            value: d.values["this"] === null ? null : +d.values["this"],
            context: d
          };
        }
        return dataObj;
      });

    // set base chart dimensions
    chart.settings = {
      width:
        parseInt(chart.chartContainer.style("width"), 10) -
        parseInt(chart.chartContainer.style("margin-right"), 10),
      height: chart.chartHeight,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      hovercardBuffer: { x: 0, y: 25 }
    };

    // add blank hovercard
    chart.initHovercard();

    // time to make the chart
    chart.draw();
    chart.dimensions = {
      height: chart.chartContainer.node().offsetHeight,
      width: chart.chartContainer.node().offsetWidth
    };
    return chart;
  };

  chart.draw = function() {
    chart.chartContainer.classed("chart", true);

    // hand off based on desired type of chart
    if (chart.chartType == "pie") {
      chart.makePieChart();
    } else if (
      chart.chartType == "column" ||
      chart.chartType == "grouped_column" ||
      chart.chartType == "histogram"
    ) {
      chart.makeColumnChart();
    } else if (chart.chartType == "bar" || chart.chartType == "grouped_bar") {
      chart.makeBarChart();
    }
    return chart;
  };

  chart.makeBarChart = function() {
    chart.chartContainer.classed("bar-chart", true);

    // add basic settings specific to this chart type
    chart.updateSettings({
      margin: { top: 0, right: 10, bottom: 0, left: 10 },
      tickPadding: 5,
      outerColumnPadding: 0.25,
      columnPadding: 0.1
    });

    // add optional title, adjust height if necessary
    if (!!chart.chartChartTitle) {
      chart.addChartTitle(chart.chartContainer);
    }
    if (!!chart.chartChartSubtitle) {
      chart.addChartSubtitle(chart.chartContainer);
    }

    chart.updateSettings({
      displayWidth:
        chart.settings.width -
        chart.settings.margin.left -
        chart.settings.margin.right,
      displayHeight:
        chart.settings.height -
        chart.settings.margin.top -
        chart.settings.margin.bottom
    });

    // primary div container
    chart.htmlBaseContainer = chart.chartContainer
      .append("div")
      .attr("class", "div-chart")
      .attr("width", "100%");

    // x scale and axis, account for raw number vs. percentages
    if (chart.chartStatType == "percentage") {
      var xDomain = [0, 100],
        xTickRange = d3.range(0, 101, 25);
    } else {
      if (chart.chartType == "grouped_bar") {
        var xValues = [];
        chart.chartDataValues.forEach(function(d, i) {
          d3.values(d.values).forEach(function(v, i) {
            xValues.push(v.value);
          });
        });
      } else {
        var xValues = chart.chartDataValues.map(function(d) {
          return d.value;
        });
      }
      var xDomain = [0, d3.max(xValues) * 1.33],
        xTickRange = d3.range(
          0,
          d3.max(xValues) * 1.33,
          (d3.max(xValues) * 1.33) / 5
        );
    }
    chart.x = d3.scale
      .linear()
      .range([chart.settings.displayWidth, 0])
      .domain(xDomain);

    chart.htmlBase = chart.htmlBaseContainer
      .selectAll(".bar-set")
      .data(chart.chartDataValues)
      .enter()
      .append("div")
      .classed("bar-set", true);

    if (chart.chartType == "grouped_bar") {
      // grouped presentation
      chart.barGroups = chart.htmlBase
        .append("div")
        .attr("class", "bar-group")
        .each(function(d, i) {
          var g = d3.select(this),
            groupValues = d3.values(d.values);

          // place each label at top of bar-group
          g.append("h3")
            .classed("chart-title", true)
            .text(function(d) {
              return d.name;
            });

          // drop each bar into bar-group
          groupValues.forEach(function(v, i) {
            bar = g
              .append("a")
              .attr("class", "bar")
              .style("position", "relative")
              .style("width", function(d) {
                return chart.settings.displayWidth + "px";
              })
              .datum(function(d) {
                return v;
              });

            bar
              .append("span")
              .attr("class", "area")
              .style(
                "background-color",
                chart.colorbrewer[chart.chartColorScale][i]
              )
              .style("width", function(d) {
                return chart.settings.displayWidth - chart.x(d.value) + "px";
              });

            bar
              .append("span")
              .classed("label", true)
              .style("left", function(d) {
                return chart.settings.displayWidth - chart.x(d.value) + "px";
              })
              .html(function(d) {
                return chart.getValueFmt(v);
              });

            // add the specific label below the bar
            g.append("h4")
              .classed("label secondary", true)
              .text(function(d) {
                return chart.capitalize(v.name);
              });
          });
        });
    } else {
      // standard presentation
      chart.bars = chart.htmlBase
        .append("a")
        .attr("class", "bar")
        .style("position", "relative")
        .style("width", function(d) {
          return chart.settings.displayWidth + "px";
        })
        .datum(function(d) {
          return d;
        });

      chart.barAreas = chart.bars
        .append("span")
        .attr("class", "area")
        .style("background-color", chart.colorbrewer[chart.chartColorScale][0])
        .style("width", function(d) {
          return chart.settings.displayWidth - chart.x(d.value) + "px";
        });

      chart.bars
        .append("span")
        .classed("label", true)
        .style("left", function(d) {
          return chart.settings.displayWidth - chart.x(d.value) + "px";
        })
        .html(function(d) {
          return chart.getValueFmt(d);
        });

      // labels appear below bars
      chart.labels = chart.htmlBase
        .append("h4")
        .classed("label", true)
        .text(function(d) {
          return d.name;
        });
    }

    // now that bars are in place, capture height for hover calculations
    chart.settings.height = parseInt(chart.chartContainer.style("height"), 10);

    // listen for interactions
    chart.bars = chart.htmlBase
      .selectAll(".bar")
      .on("click", chart.cardToggle)
      .on("mouseover", chart.mouseover)
      .on("mouseout", chart.mouseout);

    chart.chartContainer.on("mousemove", chart.mousemove);

    if (!!chart.chartQualifier) {
      chart.addChartQualifier(chart.chartContainer);
    }
    if (!!chart.chartRelease) {
      chart.addChartRelease(chart.chartContainer);
    }
    if (!!chart.chartSourceLink) {
      chart.addChartSource(chart.chartContainer);
    }
    if (showActions) {
      chart.addActionLinks();
    }

    return chart;
  };

  chart.makeColumnChart = function() {
    chart.chartContainer.classed("column-chart", true);

    // add basic settings specific to this chart type
    chart.updateSettings({
      margin: { top: 20, right: 0, bottom: 10, left: 30 },
      tickPadding: 5,
      outerColumnPadding: 0.25,
      columnPadding: 0.1
    });

    // adjust left margin, padding for charts hiding Y axis
    if (!chart.chartChartShowYAxis || chart.chartChartShowYAxis == "false") {
      chart.updateSettings({
        margin: { top: 20, right: 0, bottom: 10, left: 0 },
        tickPadding: 5,
        outerColumnPadding: 0.05
      });
    }

    // store width and height available for chart elements
    chart.updateSettings({
      displayWidth:
        chart.settings.width -
        chart.settings.margin.left -
        chart.settings.margin.right,
      displayHeight:
        chart.settings.height -
        chart.settings.margin.top -
        chart.settings.margin.bottom
    });

    // add optional title, adjust height available height for columns if necessary
    if (!!chart.chartChartTitle) {
      chart.addChartTitle(chart.chartContainer);
    }
    if (!!chart.chartChartSubtitle) {
      chart.addChartSubtitle(chart.chartContainer);
    }

    // create the base for upcoming html elements
    chart.htmlBase = chart.chartContainer
      .append("div")
      .attr("class", "column-set")
      .style("margin-top", 0)
      .style("height", chart.settings.height + "px")
      .style("overflow", "auto hidden");

    // narrow padding for histograms
    if (chart.chartType == "histogram") {
      chart.updateSettings({
        columnPadding: 0.025
      });
    }

    // extra padding between groups for grouped columns
    if (chart.chartType == "grouped_column") {
      chart.updateSettings({
        columnPadding: 0.2
      });
      chart.settings.height += 25;
    }

    // x scale, axis and labels
    chart.x = d3.scale
      .ordinal()
      .rangeRoundBands(
        [0, chart.settings.displayWidth],
        chart.settings.columnPadding,
        chart.settings.outerColumnPadding
      )
      .domain(
        chart.chartDataValues.map(function(d) {
          return d.name;
        })
      );

    // y scale and axis, account for raw number vs. percentages
    if (chart.chartStatType == "percentage") {
      var yDomain = [0, 100],
        yTickRange = d3.range(0, 101, 25);
    } else {
      if (chart.chartType == "grouped_column") {
        var yValues = [];
        chart.chartDataValues.forEach(function(d, i) {
          d3.values(d.values).forEach(function(v, i) {
            yValues.push(v.value);
          });
        });
      } else {
        var yValues = chart.chartDataValues.map(function(d) {
          return d.value;
        });
      }

      var yDomain = [0, d3.max(yValues) * 1.33],
        yTickRange = d3.range(
          0,
          d3.max(yValues) * 1.33,
          (d3.max(yValues) * 1.33) / 5
        );
    }
    chart.y = d3.scale
      .linear()
      .range([chart.settings.displayHeight, 0])
      .domain(yDomain);

    if (chart.chartChartShowYAxis) {
      //check if column-set has a scrollbar, when data value greater than 10
      let marginBottom = 0;
      if (chart.chartDataValues.length > chart.columnOffset) {
        marginBottom = "15px";
      }
      // if we really need to render a y axis, easier to use an svg
      chart.svgBaseContainer = chart.chartContainer
        .append("svg")
        .attr("class", "svg-chart")
        .attr("width", "100%")
        .attr("height", chart.settings.displayHeight  + chart.settings.margin.top +
        chart.settings.margin.bottom)
        .style("margin-bottom", marginBottom)
        .style("margin-top", -(chart.settings.displayHeight  + chart.settings.margin.top +
          chart.settings.margin.bottom) + "px");

      // base where columns and axes will be attached
      chart.svgBase = chart.svgBaseContainer
        .append("g")
        .attr(
          "transform",
          "translate(" +
            chart.settings.margin.left +
            ", 0)"
        );

      chart.yAxis = d3.svg
        .axis()
        .scale(chart.y)
        .orient("left")
        .tickSize(-chart.settings.displayWidth)
        .tickPadding(chart.settings.tickPadding)
        .tickValues(yTickRange);

      chart.yAxisBase = chart.svgBase
        .append("g")
        .attr("class", "y axis")
        .call(chart.yAxis);
    }

    // add columns as <a> elements, with built-in category labels
    if (chart.chartType == "grouped_column") {
      var g, groupValues, columnWidth, column;

      // a little extra tick padding for dual labels
      chart.settings.tickPadding += 5;

      chart.chartContainer.classed("grouped-column-chart", true);

      chart.columnGroups = chart.htmlBase
        .selectAll(".column-group")
        .data(chart.chartDataValues)
        .enter()
        .append("div")
        .attr("class", "column-group")
        .each(function(d, i) {
          g = d3.select(this);
          groupValues = d3.values(d.values);
          columnWidth = Math.floor(chart.x.rangeBand() / groupValues.length) < chart.columnWidth? chart.columnWidth : Math.floor(chart.x.rangeBand() / groupValues.length);

          g.append("span")
            .classed("x axis label", true)
            .style("width", chart.x.rangeBand() + "px")
            .style("top", function(d) {
              return chart.settings.displayHeight + 51 + "px";
            })
            .style("left", function(d) {
                if(chart.chartDataValues.length > (chart.columnOffset-groupValues.length)) {
                  return (
                    chart.x(d.name) * (1 +  groupValues.length) +
                    chart.settings.margin.left +
                    "px"
                  );
                }
              return chart.x(d.name) + chart.settings.margin.left + "px";
            })
            .text(function(d) {
              return chart.capitalize(d.name);
            });

          groupValues.forEach(function(v, i) {
            column = g
              .append("a")
              .attr("class", "column")
              .style("width", columnWidth + "px")
              .style("bottom", function(d) {
                return (
                  chart.settings.margin.bottom +
                  chart.settings.tickPadding +
                  "px"
                );
              })
              .style("left", function(d) {
                if(chart.chartDataValues.length > (chart.columnOffset-groupValues.length)) {
                  return (
                    chart.x(d.name) * (1 +  groupValues.length) +
                    chart.settings.margin.left +
                    (columnWidth + 2) * i +
                    "px"
                  );
                }
                return (
                  chart.x(d.name) +
                  chart.settings.margin.left +
                  (columnWidth + 2) * i +
                  "px"
                );
              })
              .style("height", function(d) {
                return chart.settings.displayHeight + "px";
              })
              .datum(function(d) {
                return v;
              });

            column
              .append("span")
              .attr("class", "area")
              .style("position", "absolute")
              .style(
                "background-color",
                chart.colorbrewer[chart.chartColorScale][i]
              )
              .style("width", columnWidth + "px")
              .style("bottom", "0")
              .style("height", function(d) {
                return chart.settings.displayHeight - chart.y(v.value) + "px";
              });

            column
              .append("span")
              .classed("x axis label secondary", true)
              .style("top", function(d) {
                return chart.settings.displayHeight + 5 + "px";
              })
              .text(function(d) {
                return chart.capitalize(v.name);
              });
            if(!chart.chartChartShowYAxis) {
              column
                .append("span")
                .classed("label", true)
                .style("bottom", function(d) {
                  return (
                    chart.settings.displayHeight - chart.y(d.value) + 3 + "px"
                  );
                })
                .html(function(d) {
                  return chart.getValueFmt(v);
                });
            }
          });
        });

      // now that we've created all the columns in their groups,
      // select them for interaction handling
      chart.columns = chart.htmlBase.selectAll(".column");
    } else {
      let columnWidth = chart.x.rangeBand() < chart.columnWidth? chart.columnWidth : chart.x.rangeBand();
      chart.columns = chart.htmlBase
        .selectAll(".column")
        .data(chart.chartDataValues)
        .enter()
        .append("a")
        .attr("class", "column")
        .style("width", columnWidth + "px")
        .style("bottom", function(d) {
          return (
            chart.settings.margin.bottom + chart.settings.tickPadding + "px"
          );
        })
        .style("left", function(d) {
          if(chart.chartDataValues.length > chart.columnOffset) {
            return chart.x(d.name) * 2 + chart.settings.margin.left + "px";
          }
          return chart.x(d.name) + chart.settings.margin.left + "px";
        })
        .style("height", function(d) {
          return chart.settings.displayHeight + "px";
        });

      chart.columnAreas = chart.columns
        .append("span")
        .attr("class", "area")
        .style("position", "absolute")
        .style("background-color", chart.colorbrewer[chart.chartColorScale][0])
        .style("width", columnWidth + "px")
        .style("bottom", function(d) {
          return (
            chart.settings.margin.bottom +
            chart.settings.tickPadding +
            (d.value !== null ? 0 : 20) +
            "px"
          );
        })
        .style("height", function(d) {
          return chart.settings.displayHeight - chart.y(d.value) + "px";
        });

      chart.columnNames = chart.columns
        .append("span")
        .classed("x axis label", true)
        .style("top", function(d) {
          return chart.settings.displayHeight - 10 + "px";
        })
        .text(function(d) {
          return d.name;
        });

      if(!chart.chartChartShowYAxis) {
        chart.labels = chart.columnAreas
          .append("span")
          .classed("label", yLabel)
          .style("bottom", function(d) {
            return chart.settings.displayHeight - chart.y(d.value) + 3 + "px";
          })
          .html(function(d) {
            return chart.getValueFmt(d);
          });
      }
    }

    // listen for column interactions
    chart.columns
      .on("click", chart.cardToggle)
      .on("mouseover", chart.mouseover)
      .on("mouseout", chart.mouseout);

    chart.chartContainer.on("mousemove", chart.mousemove);

    if (!!chart.chartQualifier) {
      chart.addChartQualifier(chart.chartContainer);
    }
    if (!!chart.chartRelease) {
      chart.addChartRelease(chart.chartContainer);
    }
    if (!!chart.chartSourceLink) {
      chart.addChartSource(chart.chartContainer);
    }
    if (showActions) {
      chart.addActionLinks();
    }

    return chart;
  };

  chart.makePieChart = function() {
    chart.chartContainer.classed("pie-chart", true);

    // give the chart display dimensions
    chart.updateSettings({
      legendWidth: chart.settings.width * 0.38,
      pieWidth: chart.settings.width * 0.58,
      displayWidth:
        chart.settings.width -
        chart.settings.margin.left -
        chart.settings.margin.right,
      displayHeight:
        chart.settings.height -
        chart.settings.margin.top -
        chart.settings.margin.bottom
    });

    // add optional title, adjust height available height for arcs if necessary
    if (!!chart.chartChartTitle) {
      chart.addChartTitle(chart.chartContainer);
      chart.settings.displayHeight -= 20;
    }
    if (!!chart.chartChartSubtitle) {
      chart.addChartSubtitle(chart.chartContainer);
    }

    // if width is narrow enough that legend won't have room
    // for decent display, drop it below the chart instead
    if (chart.settings.pieWidth / chart.settings.displayHeight < 0.85) {
      chart.updateSettings({
        legendWidth: chart.settings.displayWidth,
        pieWidth: chart.settings.width * 0.78
      });
    }

    // give the chart its radius
    chart.updateSettings({
      radius:
        Math.min(chart.settings.pieWidth, chart.settings.displayHeight) / 2.1,
      pieCenter: chart.settings.pieWidth / 2
    });

    // create array of categories specific to this chart
    chart.chartCategories = chart.chartDataValues.map(function(d) {
      return d.name;
    });

    // use ColorBrewer Set2 for pie charts
    chart.color = d3.scale
      .ordinal()
      .domain(chart.chartCategories)
      .range(chart.colorbrewer[chart.chartColorScale]);

    // adjust radii to set chart's size relative to container
    chart.arc = d3.svg
      .arc()
      .outerRadius(chart.settings.radius)
      .innerRadius(chart.settings.radius / 1.5);

    // put this chart's data into D3 pie layout
    chart.pie = d3.layout
      .pie()
      .sort(null)
      .value(function(d) {
        return d.value;
      });
    chart.pieData = chart.pie(chart.chartDataValues);

    // get the max value for initial labeling
    if (!!chart.chartInitialSort) {
      chart.initialSlice = chart.pieData
        .slice(0)
        .sort(chart.sortDataBy(chart.chartInitialSort))[0];
    } else {
      chart.initialSlice = chart.pieData[0];
    }

    // primary svg container
    chart.svgBase = chart.chartContainer
      .append("svg")
      .attr("class", "svg-chart")
      .attr("width", "100%")
      .attr("height", chart.settings.displayHeight);

    // group for arcs, to be added later
    chart.arcGroup = chart.svgBase
      .append("g")
      .attr("class", "arc-group")
      .attr(
        "transform",
        "translate(" +
          chart.settings.pieWidth / 2 +
          "," +
          (chart.settings.displayHeight / 2 + chart.settings.margin.top) +
          ")"
      );

    // primary html container
    chart.htmlBase = chart.chartContainer
      .append("div")
      .attr("class", "div-chart")
      .style("position", "relative")
      .style("width", "0")
      .style("margin-top", -chart.settings.displayHeight + "px")
      .style("height", chart.settings.displayHeight - 4 + "px");

    // center text group
    chart.centerGroup = chart.htmlBase
      .append("div")
      .attr("class", "center-group")
      .style("position", "relative")
      .style("width", "0")
      .style("height", chart.settings.displayHeight + "px");

    // center label
    chart.centerLabel = chart.centerGroup
      .append("span")
      .attr("class", "label-name")
      .style(
        "left",
        chart.settings.pieCenter - (chart.settings.radius / 1.5) * 0.95 + "px"
      )
      .style(
        "bottom",
        chart.settings.displayHeight / 2 + chart.settings.margin.top + 10 + "px"
      )
      .style("width", (chart.settings.radius / 1.5) * 1.9 + "px");

    // center value
    chart.centerValue = chart.centerGroup
      .append("span")
      .attr("class", "label-value")
      .style(
        "left",
        chart.settings.pieCenter - (chart.settings.radius / 1.5) * 0.95 + "px"
      )
      .style(
        "top",
        chart.settings.displayHeight / 2 + chart.settings.margin.top - 7 + "px"
      )
      .style("width", (chart.settings.radius / 1.5) * 1.9 + "px");

    // interaction state highlights the arc and associated legend item,
    // and displays the data name and value in center of chart.
    // filters based on data to trigger arc/legend at same time.
    chart.arcHover = function(data) {
      chart.arcs
        .filter(function(d) {
          return d == data;
        })
        .classed("hovered", true);

      chart.legendItems
        .filter(function(d) {
          return d == data;
        })
        .classed("hovered", true);

      chart.centerLabel.text(data.data.name);
      chart.centerValue.html(chart.getValueFmt(data.data));

      // also trigger standard mouseover
      chart.mouseover(data.data);
    };

    // return arc and associated legend item to normal styles
    chart.arcReset = function() {
      chart.arcs.classed("hovered", false);
      chart.legendItems.classed("hovered", false);

      chart.centerLabel.text(chart.initialSlice.data.name);
      chart.centerValue.html(chart.getValueFmt(chart.initialSlice.data));

      chart.mouseout();
    };

    // add arc paths to arc group
    chart.arcs = chart.arcGroup
      .selectAll(".arc")
      .data(chart.pieData)
      .enter()
      .append("path")
      .classed("arc", true)
      .attr("d", chart.arc)
      .style("fill", function(d) {
        return chart.color(d.data.name);
      });

    // place legend to right of chart, or below if necessary
    if (chart.settings.legendWidth < chart.settings.displayWidth) {
      chart.legend = chart.htmlBase
        .append("ul")
        .attr("class", "legend")
        .style("position", "absolute")
        .style("width", chart.settings.legendWidth + "px")
        .style(
          "left",
          chart.settings.displayWidth - chart.settings.legendWidth + "px"
        )
        .style("top", "1em");
    } else {
      chart.legend = chart.chartContainer
        .append("ul")
        .attr("class", "legend legend-full-width clearfix");

      chart.updateSettings({
        height: parseInt(chart.settings.height) + 50
      });
    }

    // add legend items
    var g;
    chart.legendItems = chart.legend
      .selectAll("li")
      .data(chart.pieData)
      .enter()
      .append("li")
      .attr("class", "legend-item")
      .style("display", "flex")
      .style("align-items", "center")
      .each(function(d, i) {
        g = d3.select(this);
        g.append("span")
          .attr("class", "swatch")
          .style("height", "25px")
          .style("width", "25px")
          .style("margin-right", "12px")
          .style("background-color", function(d) {
            return chart.color(d.data.name);
          });

        g.append("span")
          .attr("class", "label")
          .text(d.data.name);
      });

    // add initial center label
    chart.arcReset();

    // listen for arc interactions
    chart.arcs
      .on("click", chart.cardToggle)
      .on("mouseover", chart.arcHover)
      .on("mouseout", chart.arcReset);

    // listen for legend interactions
    chart.legendItems
      .on("click", chart.cardToggle)
      .on("mouseover", chart.arcHover)
      .on("mouseout", chart.arcReset);

    chart.chartContainer.on("mousemove", chart.mousemove);

    // add any explanatory lines
    if (!!chart.chartQualifier) {
      chart.addChartQualifier(chart.chartContainer);
    }
    if (!!chart.chartRelease) {
      chart.addChartRelease(chart.chartContainer);
    }
    if (!!chart.chartSourceLink) {
      chart.addChartSource(chart.chartContainer);
    }
    if (showActions) {
      chart.addActionLinks();
    }

    return chart;
  };

  chart.addActionLinks = function() {

    chart.actionLinks = chart.chartActions
      .insert("div", ":first-child")
        .classed("chart-action-links-container", true)
      .style("diplay", "flex")
      .style("justify-content", "center")
      .style("padding", "0 1rem")
      .style("padding-top", "1.25rem")
      .insert("div")
      .classed("chart-action-links", true);

    chart.share = chart.actionLinks
        .append("a")
        .attr("ga-on", "click")
        .attr("ga-event-category", "Data")
        .attr("ga-event-action","Share")
        .attr("ga-event-label", window.takwimu.country.slug + '-' + chart.id)
        .on("click", chart.share);
    chart.share.append('img')
        .attr('src', (STATIC_PREFIX || '/static/') + 'img/network-connection.svg');
    chart.share.append('p')
        .text("Share");

    chart.actionDownload = chart.actionLinks
        .append("a")
        .attr("ga-on", "click")
        .attr("ga-event-category", "Data")
        .attr("ga-event-action","Download")
        .attr("ga-event-label", window.takwimu.country.slug + '-' + chart.id)
        .on("click", chart.download);
    chart.actionDownload.append('img')
        .attr('src', (STATIC_PREFIX || '/static/') + 'img/download.svg');
    chart.actionDownload.append('p')
        .text("Download");

    chart.showEmbed = chart.actionLinks
        .append("a")
        .attr("ga-on", "click")
        .attr("ga-event-category", "Data")
        .attr("ga-event-action","Embed")
        .attr("ga-event-label", window.takwimu.country.slug + '-' + chart.id)
        .on("click", chart.showEmbedCode);
    chart.showEmbed.append('img')
        .attr('src', (STATIC_PREFIX || '/static/') + 'img/code.svg');
    chart.showEmbed.append('p')
        .text("Embed");

    chart.compare = chart.actionLinks
        .append("a")
        .attr("ga-on", "click")
        .attr("ga-event-category", "Data")
        .attr("ga-event-action","Compare")
        .attr("ga-event-label", window.takwimu.country.slug + '-' + chart.id)
        .attr("href", chart.distributionURL);
    chart.compare.append('img')
        .attr('src', (STATIC_PREFIX || '/static/') + 'img/compare.svg');
    chart.compare.append('p')
        .text("Compare");

    chart.showData = chart.actionLinks
        .append("a")
        .attr("ga-on", "click")
        .attr("ga-event-category", "Data")
        .attr("ga-event-action","ShowData")
        .attr("ga-event-label", window.takwimu.country.slug + '-' + chart.id)
        .on("click", chart.toggleDataDrawer);
    chart.showData.append('img')
        .attr('src', (STATIC_PREFIX || '/static/') + 'img/tablet-reader-31.svg');
    chart.showData.append('p')
        .text("Show Data");
  };

  chart.fillEmbedCode = function(textarea, align) {
    var embedHeight = 300,
      embedWidth = chart.chartType == "pie" ? 300 : 720,
      embedKey = chart.chartDataKey.substring(
        chart.chartDataKey.indexOf("-") + 1
      ),
      embedDataYear = chart.initialData.metadata.year,
      embedID = "cr-embed-" + chart.primaryGeoID + "-" + embedKey,
      embedParams = {
        geoID: chart.primaryGeoID,
        geoVersion: chart.thisGeo.version,
        chartDataID: embedKey,
        dataYear: embedDataYear,
        chartType: chart.chartType,
        chartHeight: 200,
        chartQualifier: chart.chartQualifier || "",
        chartRelease: chart.chartRelease || "",
        chartSourceTitle: chart.chartSourceTitle || "",
        chartSourceLink: chart.chartSourceLink || "",
        chartTitle: chart.chartChartTitle || "",
        chartSubtitle: chart.chartChartSubtitle || "",
        initialSort: chart.chartInitialSort || "",
        statType: chart.chartStatType || ""
      };
    embedAlign =
      align == "left" || align == "right" ? " float: " + align + ";" : "";

    var querystring = $.param(embedParams);

    var embedCode = [
      '<iframe id="' +
        embedID +
        '" class="census-reporter-embed" src="' +
        EMBED_URL +
        "/embed/iframe.html?" +
        querystring +
        '" frameborder="0" width="100%" height="300" style="margin: 1em; max-width: ' +
        embedWidth +
        "px;" +
        embedAlign +
        '"></iframe>',
      '\n<script src="' +
        EMBED_URL +
        (STATIC_PREFIX || '/static/') + 'js/embed.chart.make.js"></script>'
    ].join("");

    textarea.html(embedCode);
  };

  chart.showEmbedCode = function() {
    var lightboxWrapper = d3
      .select("body")
      .append("div")
      .attr("id", "lightbox");

    var lightbox = lightboxWrapper
      .append("div")
      .classed("hovercard-wrapper", true)
      .append("div")
      .classed("hovercard", true);

    lightbox
      .append("small")
      .classed("close clearfix", true)
      .html('<i class="fa fa-times-circle"></i> Close')
      .on("click", function() {
        d3.event.stopPropagation();
        d3.select("#lightbox").remove();
      });

    lightbox.append("h2").html("Embed code for this chart");

    lightbox
      .append("p")
      .text(
        "Copy the code below, then paste into your own CMS or HTML. Embedded charts are responsive to your page width, and have been tested in Firefox, Safari, Chrome, and IE8 and above."
      );

    var textarea = lightbox.append("textarea").on("click", function() {
      this.select();
    });

    lightbox
      .append("p")
      .classed("filter-list display-type", true)
      .html("<strong>Align this embedded chart in text:</strong> ")
      .selectAll("a")
      .data(["Normal", "Left", "Right"])
      .enter()
      .append("a")
      .attr("id", function(d) {
        return "embed-align-" + d.toLowerCase();
      })
      .text(function(d) {
        return d;
      })
      .on("click", function() {
        d3.event.stopPropagation();
        d3.selectAll(".filter-list a").classed("option-selected", false);
        d3.select(this).classed("option-selected", true);
        chart.fillEmbedCode(textarea, this.text.toLowerCase());
      });

    d3.select("#embed-align-normal").classed("option-selected", true);

    // lightbox.append('p').append('a')
    //         .classed('display-type', true)
    //         .attr('href', '/examples/embed-charts/')
    //         .attr('target', '_blank')
    //         .html('Learn more about ' + SITE_NAME + '&rsquo;s embedded charts');

    chart.fillEmbedCode(textarea);
  };

  // pass in data obj, get back formatted value label with MOE flag
  chart.getValueFmt = function(data, geoStr, precision) {
    var place = !!geoStr ? geoStr : "this",
      decimals = !!precision ? precision : 0,
      valueText = data.context.values[place],
      valueMOEFlag =
        data.context.error_ratio[place] >= 10 ? "<sup>&dagger;</sup>" : "";
    return chart.valFmt(valueText, decimals) + valueMOEFlag;
  };

  // opens drawer with tabular data under chart
  chart.toggleDataDrawer = function() {
    var row = d3.select(chart.findAncestor(this, "section")),
      clickTargets = row.selectAll(".chart-get-data"),
      clicked = d3.select(this),
      hide = clicked.classed("opened"),
      tableID = chart.capitalize(chart.initialData.metadata.table_id);
    chart.dataDrawer = row.select(".data-drawer");

    // make sure we're in a pristine state
    chart.dataDrawer.remove();
    clickTargets.text("Show data").classed("opened", false);

    // handle the toggling
    if (hide) {
      clicked.classed("opened", false);
    } else {
      clicked.classed("opened", true);

      // tell Google Analytics about the event
      chart.trackEvent("Charts", "Show data", tableID);

      chart.dataDrawer = row
        .append("div")
        .attr("class", "data-drawer column-full");

      chart.dataDrawer
        .append("h3")
        .attr("class", "chart-title")
        .html(function() {
          var titleText;
          if (!!chart.chartChartTitle) {
            titleText = chart.chartChartTitle + " (Table " + tableID + ")";
          } else {
            titleText = "Table " + tableID;
          }
          return titleText;
        })
        .append("a")
        .attr("href", chart.tableURL)
        .html("Explore and download this data");

      chart.dataTable = chart.dataDrawer
        .append("table")
        .attr("id", "data-table")
        .attr("class", "full-width");

      // get chart data ready for tabular format
      var rowValues = [];
      chart.chartDataValues.forEach(function(d, i) {
        if (!!d.context) {
          // standard chart
          rowValues.push(d);
        } else {
          // data shaped for grouped chart
          d.values.forEach(function(k, i) {
            k.name = d.name + ": " + chart.capitalize(k.name);
            rowValues.push(k);
          });
        }
      });

      chart.dataTableHeader = chart.dataTable
        .append("thead")
        .append("tr")
        .call(chart.fillDataDrawerHeader, rowValues[0]);

      chart.tableRows = chart.dataTable
        .append("tbody")
        .call(chart.fillDataDrawerRows, rowValues);

      chart.dataDrawer
        .append("a")
        .classed("chart-get-data opened", true)
        .text("Hide data")
        .on("click", chart.toggleDataDrawer);
    }
  };

  chart.DataDrawerPlaces = ["this", "province", "country"];

  chart.fillDataDrawerHeader = function(selection, d) {
    var headerData = [
      { colspan: 1, cellClass: "name", cellContents: "Column" }
    ];

    _.each(d.context.values, function(v, k) {
      headerData.push({
        colspan: d.context.numerators[k] !== null ? 2 : 1,
        cellClass: "name",
        cellContents: chart.comparisonNames[k]
      });
    });

    selection
      .selectAll("th")
      .data(headerData)
      .enter()
      .append("th")
      .attr("class", function(d) {
        return d.cellClass;
      })
      .attr("colspan", function(d) {
        return d.colspan;
      })
      .text(function(d) {
        return d.cellContents;
      });
  };

  chart.fillDataDrawerRows = function(selection, rowValues) {
    rowValues.forEach(function(d) {
      rowData = [{ cellClass: "name", cellContents: d.name }];
      _.each(d.context.values, function(v, k) {
        // add the primary value
        rowData.push({
          cellClass: "value",
          cellContents: chart.getValueFmt(d, k, chart.tableDecimalPlaces)
        });
        // rowData.push({ cellClass: 'context', cellContents: '&plusmn;' + chart.valFmt(d.context.error[k], 1) });
        // add the numerator value if it exists
        if (d.context.numerators[k] !== null) {
          rowData.push({
            cellClass: "value",
            cellContents: chart.commaFmt(d.context.numerators[k])
          });
          //rowData.push({ cellClass: 'context', cellContents: '&plusmn;' + chart.commaFmt(d.context.numerator_errors[k]) });
        }
      });

      selection
        .append("tr")
        .selectAll("td")
        .data(rowData)
        .enter()
        .append("td")
        .attr("class", function(d) {
          return d.cellClass;
        })
        .html(function(d) {
          return d.cellContents;
        });
    });
  };

  chart.initHovercard = function() {
    chart.hovercard = chart.chartContainer
      .append("div")
      .attr("class", "hovercard")
      .style("width", function() {
        return browserWidth > 480 ? "200px" : "110%";
      })
      .style("opacity", 1e-6)
      .on("click", function() {
        d3.event.stopPropagation();
        chart.mouseout();
      });

    chart.hovercard.dimensions = {
      height: 0,
      width: 0
    };
  };

  chart.cardToggle = function(data) {
    var cardData = chart.chartType == "pie" ? data.data : data;
    if (!!chart.hovercard) {
      if (chart.hovercard.style("opacity") == 1 && chart.clicked == d) {
        chart.mouseout();
      } else {
        chart.mouseover(cardData);
        chart.clicked = d;
      }
    }
  };

  chart.fillHovercard = function(data) {
    var value,
      index,
      phraseBits,
      compareBits,
      contextData = data.context,
      moeFlag =
        contextData.error_ratio["this"] >= 10 ? "<sup>&dagger;</sup>" : "",
      cardStat = chart.valFmt(contextData.values["this"]) + moeFlag,
      cardComparison = [];

    d3.keys(contextData.values).forEach(function(k, i) {
      if (k != "this") {
        value = contextData.values[k];
        index = contextData.index[k];
        moeFlag = contextData.error_ratio[k] >= 10 ? "<sup>&dagger;</sup>" : "";

        // generate the comparative text for this parent level
        if (!!index) {
          phraseBits = chart.getComparisonThreshold(index);
          compareBits =
            "<strong>" +
            phraseBits[0] +
            "</strong> " +
            phraseBits[1] +
            " the " +
            chart.getComparisonNoun() +
            " " +
            chart.comparisonNamePhrases[k] +
            ": " +
            chart.valFmt(value) +
            moeFlag;
        } else {
          compareBits =
            "<strong>" +
            chart.capitalize(k) +
            ":</strong> " +
            chart.valFmt(value) +
            moeFlag;
        }
        // add comparative text to the list
        cardComparison.push("<li>" + compareBits + "</span></li>");
      }
    });

    var card = [
      "<h3>" +
        contextData.name +
        ": <span class='normal'>" +
        cardStat +
        "</span></h3>",
      "<ul>" + cardComparison.join("") + "</ul>"
    ].join("");

    var maxMOE = d3.values(contextData.error_ratio);
    // if any MOEs get daggered, show the explanatory text
    maxMOE.sort(function(x, y) {
      return y - x;
    });
    if (maxMOE[0] >= 10) {
      card +=
        "<div class='note'><sup>&dagger;</sup> Margin of error at least 10 percent of total value</div>";
    }

    return card;
  };

  chart.mouseover = function(data) {
    // reset screen position to account for scrolling
    chart.screenPosition = chart.chartContainer.node().getBoundingClientRect();

    // ensure we have hovercard so other interactions can safely call this
    if (!!chart.hovercard) {
      chart.hovercard.html(chart.fillHovercard(data)).style("opacity", 1);

      chart.hovercard.dimensions = {
        height: chart.hovercard.node().offsetHeight,
        width: chart.hovercard.node().offsetWidth
      };
    }
  };

  chart.mousemove = function() {
    var mouseTop = d3.mouse(this)[1],
      mouseLeft = d3.mouse(this)[0],
      bufferTop =
        chart.screenPosition.top +
        mouseTop -
        chart.hovercard.dimensions.height -
        10,
      bufferRight =
        browserWidth -
        (chart.screenPosition.left +
          mouseLeft +
          chart.hovercard.dimensions.width) -
        10;

    chart.hovercard.position = {
      vertical: {
        direction: bufferTop < 10 ? "top" : "bottom",
        pixels:
          bufferTop < 10 ? mouseTop + 5 : chart.dimensions.height - mouseTop + 5
      },
      horizontal: {
        direction: bufferRight < 10 ? "right" : "left",
        pixels:
          bufferRight < 10
            ? chart.dimensions.width - mouseLeft + 5
            : mouseLeft + 5
      }
    };
    // asking for chart.hovercard.style("height") and chart.hovercard.style("width")
    // gives inconsistent results because of IE box model. So we can't count on addition
    // using hovercard height and width. Instead, we reset top/bottom and left/right
    // (in case of flips, we don't want to hold onto the old value) and position based
    // on proximity to screen edge.
    chart.hovercard
      .style("left", "auto")
      .style("right", "auto")
      .style(
        chart.hovercard.position.horizontal.direction,
        chart.hovercard.position.horizontal.pixels + "px"
      )
      .style("top", "auto")
      .style("bottom", "auto")
      .style(
        chart.hovercard.position.vertical.direction,
        chart.hovercard.position.vertical.pixels + "px"
      );
  };

  chart.mouseout = function() {
    // ensure we have hovercard so other interactions can safely call this
    if (!!chart.hovercard) {
      chart.hovercard.style("opacity", 1e-6);
    }
  };

  chart.addChartTitle = function(container) {
    if (!!chart.chartChartTitle) {
      container
        .append("h3")
        .attr("class", "chart-header")
        .text(chart.chartChartTitle);
    }
  };

  chart.addChartSubtitle = function(container) {
    if (!!chart.chartChartSubtitle) {
      container
        .append("h3")
        .attr("class", "chart-title")
        .text(chart.chartChartSubtitle);
    }
  };

  chart.addChartQualifier = function(container) {
    var appendChartQualifier = function appendChartQualifier(
      chartQualifier,
      container,
      chart
    ) {
      container
        .append("span")
        .classed("chart-qualifier", true)
        .text("* " + chartQualifier);
    };

    if (!!chart.chartQualifier) {
      var chartQualifier = chart.chartQualifier.trim().split("\n");
      for (i = 0; i < chartQualifier.length; i++) {
        appendChartQualifier(chartQualifier[i], container, chart);
      }

      chart.updateSettings({
        height: parseInt(chart.settings.height) + 20 * chartQualifier.length
      });
    }
  };

  chart.addChartRelease = function(container) {
    if (!!chart.chartRelease) {
      container
        .append("span")
        .classed("chart-qualifier", true)
        .text("* " + chart.chartRelease + " Release");

      chart.updateSettings({
        height: parseInt(chart.settings.height) + 20
      });
    }
  };

  chart.addChartSource = function(container) {
    if (!!chart.chartSourceLink) {
      container
        .append("span")
        .classed("chart-qualifier", true)
        .text("Source: ")
        .append("a")
        .attr("href", chart.chartSourceLink)
        .attr("target", "_blank")
        .attr("rel", "noopener")
        .text(chart.chartSourceTitle);

      chart.updateSettings({
        height: parseInt(chart.settings.height) + 20
      });
    }
  };

  // format percentages and/or dollar signs
  chart.valFmt = function(value, decimals) {
    if (value === null) {
      return chart.chartNullLabel;
    }
    var precision = !!decimals ? decimals : chart.decimalPlaces,
      factor = Math.pow(10, precision),
      value = Math.round(value * factor) / factor;

    if (
      chart.chartStatType == "percentage" ||
      chart.chartStatType == "scaled-percentage"
    ) {
      value += "%";
    } else if (chart.chartStatType == "dollar") {
      value = "R" + chart.commaFmt(value);
    } else {
      value = chart.commaFmt(value);
    }
    return value;
  };

  // commas for human-friendly integers
  chart.commaFmt = d3.format(",");

  chart.capitalize = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  chart.exclude = function(array, obj) {
    var i = array.length;
    while (i--) {
      if (array[i] === obj) {
        return false;
      }
    }
    return obj;
  };

  chart.lastItem = function(array) {
    return array[array.length - 1];
  };

  chart.findAncestor = function(node, match) {
    if (!node) {
      return null;
    } else if (!node.nodeType || typeof match != "string") {
      return node;
    }

    if ((match = match.split(".")).length === 1) {
      match.push(null);
    } else if (!match[0]) {
      match[0] = null;
    }

    do {
      if (
        (!match[0] || match[0].toLowerCase() == node.nodeName.toLowerCase()) &&
        (!match[1] ||
          new RegExp("( |^)(" + match[1] + ")( |$)").test(node.className))
      ) {
        break;
      }
    } while ((node = node.parentNode));

    return node;
  };

  chart.sortDataBy = function(field, sortFunc) {
    // allow reverse sorts, e.g. '-value'
    var sortOrder = field[0] === "-" ? -1 : 1;
    if (sortOrder == -1) {
      field = field.substr(1);
    }

    // allow passing in a sort function
    var key = sortFunc
      ? function(x) {
          return sortFunc(x[field]);
        }
      : function(x) {
          return x[field];
        };

    return function(a, b) {
      var A = key(a),
        B = key(b);
      return (A < B ? -1 : A > B ? +1 : 0) * sortOrder;
    };
  };

  chart.getParentHeight = function() {
    return parseInt(
      d3.select(chart.chartContainer.node().parentNode).style("height"),
      10
    );
  };

  chart.updateSettings = function(newSettings) {
    for (var setting in newSettings) {
      chart.settings[setting] = newSettings[setting];
    }
  };

  chart.comparisonPhrases = {
    206: ["more than double", ""],
    195: ["about double", ""],
    180: ["nearly double", ""],
    161: ["more than 1.5 times", ""],
    145: ["about 1.5 times", ""],
    135: ["about 1.4 times", ""],
    128: ["about 1.3 times", ""],
    122: ["about 25 percent higher", "than"],
    115: ["about 20 percent higher", "than"],
    107: ["about 10 percent higher", "than"],
    103: ["a little higher", "than"],
    98: ["about the same as", ""],
    94: ["a little less", "than"],
    86: ["about 90 percent", "of"],
    78: ["about 80 percent", "of"],
    72: ["about three-quarters", "of"],
    64: ["about two-thirds", "of"],
    56: ["about three-fifths", "of"],
    45: ["about half", ""],
    37: ["about two-fifths", "of"],
    30: ["about one-third", "of"],
    23: ["about one-quarter", "of"],
    17: ["about one-fifth", "of"],
    13: ["less than a fifth", "of"],
    8: ["about 10 percent", "of"],
    0: ["less than 10 percent", "of"]
  };

  chart.comparisonThresholds = d3.keys(chart.comparisonPhrases).map(Number);

  chart.getComparisonThreshold = function(value) {
    var threshold = chart.lastItem(
      chart.comparisonThresholds.filter(function(i) {
        return i <= value;
      })
    );

    return chart.comparisonPhrases[threshold];
  };

  chart.getComparisonNoun = function() {
    if (
      chart.chartStatType == "percentage" ||
      chart.chartStatType == "scaled-percentage"
    ) {
      return "rate";
    } else if (chart.chartStatType == "dollar") {
      return "amount";
    }
    return "figure";
  };

  chart.trackEvent = function(category, action, label) {
    // make sure we have Google Analytics function available
    if (typeof ga == "function") {
      ga("send", "event", category, action, label);
    }
  };

  chart.generateURLs = function() {
    if (chart.tableID) {
      var geoIDs = chart.geoIDs;

      chart.tableURL =
        "/data/table/?table=" +
        chart.tableID +
        "&primary_geo_id=" +
        chart.primaryGeoID +
        "&geo_ids=" +
        geoIDs.join(",") +
        "&release=" +
        chart.chartReleaseYear;

      // when showing distribution and maps, try to show relevant geos right from
      // the start.
      geoIDs = [];
      if (chart.thisGeo.parent_geoid && chart.thisGeo.parent_geoid !== 'continent-AFR') {
        // show our peers
        var parentGeo = chart.parentGeo;
        geoIDs.push(chart.thisGeo.geo_level + "|" + chart.thisGeo.parent_geoid);

        if (parentGeo.parent_geoid) {
          geoIDs.push(parentGeo.geo_level + "|" + parentGeo.parent_geoid);
        }
      } else {
        // show all children of this level
        geoIDs.push(chart.thisGeo.child_level + "|" + chart.thisGeo.full_geoid);
      }

      chart.mapURL =
        "/data/map/?table=" +
        chart.tableID +
        "&primary_geo_id=" +
        chart.primaryGeoID +
        "&geo_ids=" +
        geoIDs.join(",") +
        "&release=" +
        chart.chartReleaseYear;
      chart.distributionURL =
        "/data/distribution/?table=" +
        chart.tableID +
        "&primary_geo_id=" +
        chart.primaryGeoID +
        "&geo_ids=" +
        geoIDs.join(",") +
        "&release=" +
        chart.chartReleaseYear;
    }
  };

  const getCookie = name => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';').map(cookie => cookie.trim());
      const found = cookies.find(
        cookie => cookie.substring(0, name.length + 1) === `${name}=`
      );
      if (found) {
        cookieValue = decodeURIComponent(found.substring(name.length + 1));
      }
    }
    return cookieValue;
  };

  const toPng = () => {
    const columnSets = chart.chartContainer.node().getElementsByClassName(
      'column-set'
    );
    if (columnSets && columnSets.length) {
      columnSets[0].style.overflow = 'visible';
    }
    return domtoimage
      .toPng(chart.chartContainer.node(), { filter: (node) => {
        return node.className !== "chart-actions";
      }, bgcolor: "#fff" })
      .then(dataURL => {
        if (columnSets && columnSets.length) {
          columnSets[0].style.overflow = 'auto hidden';
        }
        return dataURL;
      })
  }

  chart.share = () => {
    toPng().then(function(dataUrl) {
        fetch('/api/twitter_view/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
          },
          body: JSON.stringify({
            id: chart.id,
            image: dataUrl
          })
        }).then(res => {
          if (res.status === 200) {
            res.json().then(json => {
              const url = new URL(window.location);
              url.searchParams.set('image', json.image.split('/').pop());
              url.searchParams.set('indicator', chart.id);
              url.searchParams.set('title', chart.chartChartTitle);
              url.searchParams.set('description', "Takwimu");
              window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url.href)}`);
            })
          }
        })
      });
    return false;
  };

  chart.download = function() {
    toPng().then(function(dataUrl) {
        var link = document.createElement("a");
        link.download = chart.chartChartTitle + ".png";
        link.href = dataUrl;

        document.body.appendChild(link); // Firefox requires this
        link.click();
        document.body.removeChild(link);
      });
    return false;
  };

  // ready, set, go
  chart.init(options);
  return chart;
}
