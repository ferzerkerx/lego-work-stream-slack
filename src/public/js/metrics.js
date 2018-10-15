const svg = d3.select('#stacked'),
  tooltip = d3.select('#tooltip'),
  margin = { top: 10, right: 10, bottom: 20, left: 40 },
  width = +svg.attr('width') - margin.left - margin.right,
  height = +svg.attr('height') - margin.top - margin.bottom;

d3.json('/api/metrics').then(jsonResponse => {
  const categories = jsonResponse.keys;

  const datesToDisplay = jsonResponse.entries.map(d => d.date);

  const totalCountsPerDates = jsonResponse.entries.map(d => {
    return d3.sum(categories.map(key => d[key]));
  });

  const orderOfDates = d3.range(jsonResponse.entries.length);

  const sumsPerDateAndCategory = jsonResponse.entries.map(d =>
    Array.from(categories, V => d[V])
  );

  const data = Object.assign(
    d3.stack().keys(d3.range(jsonResponse.keys.length))(
      d3.permute(sumsPerDateAndCategory, orderOfDates)
    ),
    {
      keys: Array.from(categories),
      totals: d3.permute(totalCountsPerDates, orderOfDates),
      names: d3.permute(datesToDisplay, orderOfDates),
    }
  );

  const y = d3
    .scaleLinear()
    .domain([0, d3.max(data.totals)])
    .rangeRound([height - margin.bottom, margin.top]);

  const x = d3
    .scaleBand()
    .domain(data.names)
    .range([margin.left, width - margin.right])
    .padding(0.1);

  const yAxis = g =>
    g
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(null, 's'))
      .call(g => g.selectAll('.domain').remove());

  const xAxis = g =>
    g
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0))
      .call(g => g.selectAll('.domain').remove());

  svg
    .append('g')
    .selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .attr('fill', (d, i) => data.keys[i])
    .on('mouseover', (d, i) => {
      const displayText = `${Math.abs(d[0][0] - d[0][1])} - ${data.keys[i]}`;

      tooltip.style('opacity', 0.9);

      tooltip
        .html(`${displayText}`)
        .style('left', `${d3.event.pageX + 30}px`)
        .style('top', `${d3.event.pageY - 30}px`);
    })
    .on('mouseout', () => {
      tooltip.style('opacity', 0);
    })
    .selectAll('rect')
    .data(d => d)
    .enter()
    .append('rect')
    .attr('x', (d, i) => x(data.names[i]))
    .attr('y', d => y(d[1]))
    .attr('height', d => y(d[0]) - y(d[1]))
    .attr('width', x.bandwidth());

  svg.append('g').call(xAxis);

  svg.append('g').call(yAxis);

  const legend = svg => {
    const g = svg
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .attr('text-anchor', 'end')
      .selectAll('g')
      .data(data.keys.slice())
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(0,${i * 20})`);

    g.append('rect')
      .attr('x', 29)
      .attr('width', 19)
      .attr('height', 19)
      .attr('fill', (d, i) => data.keys[i]);

    g.append('text')
      .attr('x', 24)
      .attr('y', 9.5)
      .attr('dy', '0.35em')
      .text(d => d);
  };

  svg
    .append('g')
    .attr('transform', `translate(${width - margin.right},${margin.top})`)
    .call(legend);
});
