import { SlackAttachment, SlackMessage, Storage } from 'botkit';
import { LegoSelectMessage } from './LegoSelectMessage';
import { LegoSelectionService } from './LegoSelectionService';
import { LegoSelectedValue } from './LegoSelectedValue';

export class LegoMetricsService {
  static metricsForDate(
    date: Date,
    storage: Storage<LegoSelectMessage>
  ): Promise<LegoSelectMessage[]> {
    //TODO need to consider also the team
    // @ts-ignore
    return storage.lego_messages
      .find({ date: date })
      .catch(e => this.defaultErrorHandling(e));
  }

  private static defaultErrorHandling(err: Error): void {
    console.error(err);
  }
}
