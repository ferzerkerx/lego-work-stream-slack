import * as d3 from 'd3';

class MetricsStackedBar {
  constructor(context) {
    this.context = context;
  }

  static _onMouseOverStackItem(d, i, context) {
    const { data, tooltip, config } = context;
    const customAttribute = d3.event.target.getAttribute('custom');
    if (!customAttribute) {
      return;
    }
    const column = Number(customAttribute.slice(-1));
    if (!Number.isInteger(column)) {
      return;
    }

    let value = Math.abs(d[column][0] - d[column][1]);

    let displayText = `${value} - ${data.categories[i]} ${
      config.isPercentage ? '%' : ''
    }`;

    tooltip.style('opacity', 0.9);

    tooltip
      .html(`${displayText}`)
      .attr('class', `d3-tip`)
      .style('left', `${d3.event.pageX + 30}px`)
      .style('top', `${d3.event.pageY - 30}px`);
  }

  static _legend(svg, context) {
    const { data } = context;
    const g = svg
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .attr('text-anchor', 'end')
      .selectAll('g')
      .data(data.categories.slice())
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(0,${i * 20})`);

    g.append('rect')
      .attr('x', 29)
      .attr('width', 19)
      .attr('height', 19)
      .attr('fill', (d, i) => data.categories[i]);

    g.append('text')
      .attr('x', 24)
      .attr('y', 9.5)
      .attr('dy', '0.35em')
      .text(d => d);
  }

  render() {
    const { y, x, yAxis, xAxis } = this._axisFunctions();

    this._renderBars(x, y);

    this._renderAxis(xAxis, yAxis);

    this._renderYAxisTitle();
    this._renderLegend();
  }

  _renderAxis(xAxis, yAxis) {
    const { svg } = this.context;
    svg.append('g').call(xAxis);

    svg.append('g').call(yAxis);
  }

  _renderBars(x, y) {
    const context = this.context;
    const { svg, data, tooltip } = context;
    svg
      .append('g')
      .selectAll('g')
      .data(data)
      .enter()
      .append('g')
      .attr('fill', (d, i) => data.categories[i])
      .on('mouseover', (d, i) =>
        MetricsStackedBar._onMouseOverStackItem(d, i, context)
      )
      .on('mouseout', () => {
        tooltip.style('opacity', 0);
      })
      .selectAll('rect')
      .data(d => d)
      .enter()
      .append('rect')
      .attr('x', (d, i) => x(data.names[i]))
      .attr('y', d => y(d[1]))
      .attr('custom', (d, i) => `col-${i}`)
      .attr('height', d => y(d[0]) - y(d[1]))
      .attr('width', x.bandwidth());
  }

  _renderLegend() {
    const context = this.context;
    const { svg, width, margin } = context;
    svg
      .append('g')
      .attr('transform', `translate(${width - margin.right},${margin.top})`)
      .call(svg => MetricsStackedBar._legend(svg, context));
  }

  _axisFunctions() {
    const { data, height, margin, width } = this.context;
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
    return { y, x, yAxis, xAxis };
  }

  _renderYAxisTitle() {
    const { svg, height, config } = this.context;
    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - 2)
      .attr('x', 0 - height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text(`${config.isPercentage ? 'Percentages' : 'Values'}`);
  }
}

export { MetricsStackedBar };
