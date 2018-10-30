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

    return this.wrapped()
      .find(query)
      .catch(e => ErrorUtil.defaultErrorHandling(e));
  }

  public find(messageId: string): Promise<LegoSelectMessage> {
    return this.wrapped().get(messageId);
  }

  public save(legoMessage: LegoSelectMessage): Promise<LegoSelectMessage> {
    return this.wrapped().save(legoMessage);
  }

  private wrapped(): any {
    return this.storage;
  }
}
