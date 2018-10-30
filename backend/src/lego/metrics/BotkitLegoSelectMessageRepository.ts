import { Storage } from 'botkit';
import { LegoSelectMessage } from '../LegoSelectMessage';
import { LegoSelectMessageRepository } from '../Types';
import { ErrorUtil } from '../../utils/ErrorUtil';

export class BotkitLegoSelectMessageRepository
  implements LegoSelectMessageRepository {
  constructor(private storage: Storage<LegoSelectMessage>) {}

  public findMessagesBy(
    config: MetricsConfiguration
  ): Promise<LegoSelectMessage[]> {
    const conditions: any = [
      { date: { $gte: config.startDate } },
      { date: { $lte: config.endDate } },
    ];

    if (config.teams && config.teams.length > 0) {
      conditions.push({ 'channelData.name': { $in: config.teams } });
    }
    const query = {
      $and: conditions,
    };

    // @ts-ignore
    return this.storage.lego_messages
      .find(query)
      .catch(e => ErrorUtil.defaultErrorHandling(e));
  }
}
