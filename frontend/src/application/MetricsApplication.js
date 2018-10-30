import * as d3 from 'd3';
import { MetricsService } from './MetricsService';
import { Renderer } from './Renderer';

class MetricsApplication {
  constructor(configSelectors) {
    this.configSelectors = configSelectors;
  }

  static findForm() {
    const form = document.forms[0];
    if (!form) {
      throw Error('Could not initialize component.');
    }
    return form;
  }

  static metricRequest() {
    const form = MetricsApplication.findForm();
    const config = MetricsService.createConfiguration(form);
    const url = MetricsService.createUrl(config);
    return { config, url };
  }

  renderWithRequest(config, url) {
    return d3.json(url).then(jsonResponse => {
      new Renderer(jsonResponse, config, this.configSelectors).render();
      return jsonResponse;
    });
  }

  render(evt) {
    evt.preventDefault();

    const { config, url } = MetricsApplication.metricRequest();
    this.renderWithRequest(config, url);
  }

  download() {
    const { config, url } = MetricsApplication.metricRequest();
    this.renderWithRequest(config, url).then(jsonResponse => {
      const { entries } = jsonResponse;
      if (!entries || entries.length === 0) {
        return;
      }
      config.format = 'csv';
      window.location.href = MetricsService.createUrl(config);
    });
  }
}

export { MetricsApplication };
