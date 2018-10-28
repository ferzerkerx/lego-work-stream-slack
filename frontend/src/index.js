import { MetricsApplication } from './MetricsApplication';

const metricsApplication = new MetricsApplication({
  svgSelector: '#graphic',
  defaultSvgSelector: '#graphicDefault',
  tooltipSelector: '#tooltip',
});

document.getElementById('downloadButton').addEventListener('click', () => {
  metricsApplication.download();
});

document.getElementById('searchButton').addEventListener('click', event => {
  metricsApplication.render(event);
});
