const metrics = (() => {
  class Utils {
    static addDays(dateString) {
      const referenceDate = new Date(dateString);
      return new Date(new Date().setDate(referenceDate.getDate() + 1));
    }

    static toNumber(value) {
      const numberValue = Number(value);
      if (isNaN(numberValue)) {
        return null;
      }
      return numberValue;
    }

    static toDateString(theDate) {
      return theDate.toJSON().slice(0, 10);
    }
  }

  class MetricsService {
    static createConfiguration(form) {
      const startDate = form.startDate.value || Utils.toDateString(new Date());
      const endDate =
        form.endDate.value || Utils.toDateString(Utils.addDays(startDate, 1));
      const frequency = Utils.toNumber(form.frequency.value) || 1;
      const isPercentage = form.isPercentage.checked || false;

      return {
        startDate: startDate,
        endDate: endDate,
        frequency: frequency,
        isPercentage: isPercentage,
      };
    }

    static createUrl(config) {
      return `/api/metrics?startDate=${config.startDate}&endDate=${
        config.endDate
      }&frequency=${config.frequency}&isPercentage=${config.isPercentage}`;
    }
  }

  class MetricsStackedBar {
    constructor(context) {
      this.context = context;
    }

    static onMouseOverStackItem(d, i, context) {
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

    static legend(svg, context) {
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
      const {
        data,
        height,
        margin,
        width,
        tooltip,
        svg,
        config,
      } = this.context;
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
        .attr('fill', (d, i) => data.categories[i])
        .on('mouseover', (d, i) =>
          MetricsStackedBar.onMouseOverStackItem(d, i, this.context)
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

      svg.append('g').call(xAxis);

      svg.append('g').call(yAxis);

      svg
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0 - 2)
        .attr('x', 0 - height / 2)
        .attr('dy', '1em')
        .style('text-anchor', 'middle')
        .text(`${config.isPercentage ? 'Percentages' : 'Values'}`);

      svg
        .append('g')
        .attr('transform', `translate(${width - margin.right},${margin.top})`)
        .call(svg => MetricsStackedBar.legend(svg, this.context));
    }
  }

  class Renderer {
    constructor(jsonResponse, config) {
      this.jsonResponse = jsonResponse;
      this.config = config;
      this.svg = d3.select('#graphic');
      this.tooltip = d3.select('#tooltip');
      this.margin = { top: 10, right: 10, bottom: 20, left: 40 };
      this.width =
        +this.svg.attr('width') - this.margin.left - this.margin.right;
      this.height =
        +this.svg.attr('height') - this.margin.top - this.margin.bottom;
    }

    dataForStackedGraphic() {
      const { categories, entries } = this.jsonResponse;

      const datesToDisplay = entries.map(entry => entry.date);

      const totalCountsPerDates = entries.map(entry => {
        return d3.sum(categories.map(key => entry.valuesByCategory[key]));
      });

      const orderOfDates = d3.range(entries.length);

      const sumsPerDateAndCategory = entries.map(entry =>
        Array.from(
          categories,
          category => entry.valuesByCategory[category] || 0
        )
      );

      return Object.assign(
        d3.stack().keys(d3.range(categories.length))(
          d3.permute(sumsPerDateAndCategory, orderOfDates)
        ),
        {
          categories: Array.from(categories),
          totals: d3.permute(totalCountsPerDates, orderOfDates),
          names: d3.permute(datesToDisplay, orderOfDates),
        }
      );
    }

    render() {
      const { height, margin, width, tooltip, svg, config } = this;
      svg.selectAll('*').remove();
      const data = this.dataForStackedGraphic();

      const context = {
        data,
        tooltip,
        height,
        margin,
        width,
        svg,
        config,
      };
      new MetricsStackedBar(context).render();
    }
  }

  const requestMetrics = evt => {
    evt.preventDefault();

    const config = MetricsService.createConfiguration(document.forms[0]);

    const url = MetricsService.createUrl(config);

    d3.json(url).then(jsonResponse =>
      new Renderer(jsonResponse, config).render()
    );
  };

  return {
    render: requestMetrics,
  };
})();
