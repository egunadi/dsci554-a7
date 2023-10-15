function filter(mode) {
  if (mode === '#all') {
    current = JSON.parse(JSON.stringify(all));
  } else if (mode === '#europe') {
    current = JSON.parse(JSON.stringify(europe));
  } else if (mode === '#america') {
    current = JSON.parse(JSON.stringify(america));
  } else if (mode === '#asia') {
    current = JSON.parse(JSON.stringify(asia));
  }
  filterMode = mode;
}

function sort(mode) {
  if (mode === '#life_expectancy') {
    current.sort((a, b) => d3.ascending(a.life_expectancy, b.life_expectancy));
    //update x axis label
    d3.select('#x-axis-label').text('Sorted → from smaller to larger life expectancy at birth');
  } else if (mode === '#wage_ratio') {
    current.sort((a, b) => d3.ascending(a.wage_ratio, b.wage_ratio));
    //update x axis label
    d3.select('#x-axis-label').text('Sorted → from smaller to larger ratio of male to female wages');
  }
  x.domain(current.map(d => d.name));
  sortMode = mode;
}

function toggleSort(id) {
  d3.selectAll('.sort')
    .style('background-color', '#eee');
  d3.select(id)
    .style('background-color', 'lightblue'); // #add8e6 is hex code for lightblue
}

function toggleFilter(id) {
  //toggle buttons with class .filter
  d3.selectAll('.filter')
    .style('background-color', '#eee');
  d3.select(id)
    .style('background-color', 'lightblue');
}

///////////////////////////////////////////////////////////////
// draw the chart
///////////////////////////////////////////////////////////////

var x = d3.scaleBand();
var y = d3.scaleLinear();

var delay = function (d, i) {
  return i * 50;
};

function redraw() {
  //update scale
  x.domain(current.map(d => d.name));

  ////////////////////////////////
  // DATA JOIN FOR BARS.
  var bars = svg.selectAll('.bar')
    .data(current, d => d.name);

  // UPDATE.
  bars.transition()
    .duration(750)
    .delay(delay)
    .attr('x', d => x(d.name))
    .attr('width', x.bandwidth());

  // ENTER.
  bars.enter()
    .append('rect')
    .attr('x', d => x(d.name))
    .attr('y', d => y(0))
    .attr('width', x.bandwidth())
    .transition()
    .duration(750)
    .attr('class', 'bar')
    .attr('x', d => x(d.name))
    .attr('y', d => y(d.life_expectancy))
    .attr('width', x.bandwidth())
    .attr('height', d => height - y(d.life_expectancy));

  // EXIT.
  bars.exit()
    .transition()
    .duration(750)
    .style('opacity', 0)
    .remove();

  ////////////////////////////////
  // DATA JOIN FOR NAMES.
  var name = svg.selectAll('.name')
    .data(current, d => d.name);

  // UPDATE.
  name.transition()
    .duration(750)
    .delay(delay)
    .attr('x', (d, i) => x(d.name) + x.bandwidth() / 2);

  // ENTER.
  name.enter()
    .append('text')
    .attr('x', d => x(d.name) + x.bandwidth() / 2)
    .attr('y', d => y(d.life_expectancy) + (height - y(d.life_expectancy)) / 2)
    .style('opacity', 0)
    .transition()
    .duration(1000)
    .text(d => d.name)
    .attr('class', 'name')
    .attr('x', d => x(d.name) + x.bandwidth() / 2)
    .attr('y', d => y(d.life_expectancy) + (height - y(d.life_expectancy)) / 2)
    .style('opacity', 1);

  // EXIT.
  name.exit()
    .transition()
    .duration(750)
    .style('opacity', 0)
    .remove();
}

function transition() {
  var transition = svg.transition()
    .duration(750);

  transition.selectAll('.bar')
    .delay(delay)
    .attr('x', d => x(d.name));

  transition.selectAll('.name')
    .delay(delay)
    .attr('x', d => x(d.name) + x.bandwidth() / 2);
}

function draw() {
  x.domain(current.map(d => d.name))
    .range([0, width])
    .paddingInner(0.2);

  y.domain([0, d3.max(current, d => d.life_expectancy)])
    .range([height, 0]);

  svg.selectAll('.bar')
    .data(current, d => d.name)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', d => x(d.name))
    .attr('y', d => y(d.life_expectancy))
    .attr('width', x.bandwidth())
    .attr('height', d => height - y(d.life_expectancy));

  svg.selectAll('.name')
    .data(current, d => d.name)
    .enter()
    .append('text')
    .text(d => d.name)
    .attr('class', 'name')
    .attr('x', d => x(d.name) + x.bandwidth() / 2)
    .attr('y', d => y(d.life_expectancy) + (height - y(d.life_expectancy)) / 2);

  var xAxis;
  xAxis = d3.axisBottom()
    .scale(x)
    .ticks(0)
    .tickSize(0)
    .tickFormat('');

  svg.append('g')
    .attr('class', 'axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);

  svg.append('text')
    .attr('x', width / 2)
    .attr('y', height + 20)
    .attr('class', 'label')
    .text('Sorted → from smaller to larger life expectancy at birth')
    .attr('id', 'x-axis-label');

  var yAxis = d3.axisLeft()
    .scale(y)
    .ticks(5, 'd');

  svg.append('g')
    .attr('class', 'axis')
    .call(yAxis);

  svg.append('text')
    .attr('x', - height / 2)
    .attr('y', - margin.left * 0.7)
    .attr('transform', 'rotate(-90)')
    .attr('class', 'label')
    .append('tspan').text('life_expectancy (years)')
    .append('tspan').text('')
    .style('baseline-shift', 'super')
    .style('font-size', '0.7em');
}
