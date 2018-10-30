import * as d3 from 'd3';
import { MetricsStackedBar } from './MetricsStackedBar';

class Renderer {
  constructor(jsonResponse, config, configSelectors) {
    this.jsonResponse = jsonResponse;
    this.config = config;
    this.svg = d3.select(configSelectors.svgSelector);
    this.defaultSvg = d3.select(configSelectors.defaultSvgSelector);
    this.tooltip = d3.select(configSelectors.tooltipSelector);

    if (!this.svg || !this.tooltip || !this.defaultSvg) {
      throw Error('Could not initialize component.');
    }
    this.margin = { top: 10, right: 10, bottom: 20, left: 40 };
    this.width = +this.svg.attr('width') - this.margin.left - this.margin.right;
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
      Array.from(categories, category => entry.valuesByCategory[category] || 0)
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

  _setNoResultsContent(svg) {
    const { defaultSvg } = this;
    svg.html(defaultSvg.html());
  }

  render() {
    const { height, margin, width, tooltip, svg, config } = this;
    svg.selectAll('*').remove();
    if (this.jsonResponse.entries.length === 0) {
      this._setNoResultsContent(svg);
      return;
    }
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

export { Renderer };
