import { Express, Request, Response } from 'express';
import { SlackController } from 'botkit';
import { Metrics } from '../../lego/metrics/Metrics';
import { CsvUtils } from '../../utils/CsvUtils';
import { MetricsConfigurationFactory } from '../../lego/metrics/MetricsConfigurationFactory';
import { ServiceLocator } from '../../ServiceLocator';

const api = (webserver: Express, controller: SlackController): void => {
  webserver.get('/api/metrics', (req: Request, res: Response) => {
    const config: MetricsConfiguration = MetricsConfigurationFactory.of(req);
    ServiceLocator.getLegoMetricsService()
      .metricsForConfig(config)
      .then((entry: Metrics) => {
        if (config.format === 'csv') {
          res.setHeader('Content-Type', 'text/csv');
          res.setHeader(
            'Content-Disposition',
            'attachment; filename="metrics.csv"'
          );
          res.send(CsvUtils.toCsv(entry.csvData()));
        } else {
          res.send(JSON.stringify(entry));
        }
      });
  });
};

module.exports = api;
