import { Express, Request, Response } from 'express';
import { SlackController } from 'botkit';
import { Metrics } from '../../lego/metrics/Metrics';
import { CsvUtils } from '../../utils/CsvUtils';
import { Container } from '../../Container';
import { LegoMetricsService } from '../../lego/Types';
import { MetricsConfigurationFactory } from '../../lego/metrics/MetricsConfigurationFactory';

function getLegoMetricsService(): LegoMetricsService {
  return Container.resolve<LegoMetricsService>('legoMetricsService');
}

const api = (webserver: Express, controller: SlackController): void => {
  webserver.get('/api/metrics', (req: Request, res: Response) => {
    const config: MetricsConfiguration = MetricsConfigurationFactory.of(req);
    getLegoMetricsService()
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
