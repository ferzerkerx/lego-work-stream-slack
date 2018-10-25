import { SlackMessage, Storage } from 'botkit';
import { DateUtils } from '../utils/DateUtils';
import { ErrorUtil } from '../utils/ErrorUtil';

export class LegoMessageFactory {
  static defaultConfiguration(): LegoMessageConfig {
    return {
      actionDescriptors: [
        { name: 'green', text: 'Green' },
        { name: 'red', text: 'Red' },
        { name: 'orange', text: 'Orange' },
        { name: 'black', text: 'Black' },
      ],
      min: 0,
      max: 8,
    };
  }

  static createMessage(
    storage: Storage<LegoMessageConfig>,
    channelName: string,
    date: Date = new Date()
  ): Promise<SlackMessage> {
    const conditions: any = [{ channelName: channelName }];

    const query = {
      $and: conditions,
    };

    // @ts-ignore
    return storage.team_configurations
      .find(query)
      .then(storedConfig => {
        let config: LegoMessageConfig =
          storedConfig && storedConfig.length > 0
            ? storedConfig[0]
            : this.defaultConfiguration();

        return {
          text: `Please select your legos for today: ${DateUtils.toPrettyDate(
            date.toDateString()
          )}`,
          attachments: [
            {
              text: 'Choose your legos!',
              fallback: 'Unable to set lego stats',
              callback_id: 'lego_stats',
              color: '#3AA3E3',
              attachment_type: 'default',
              actions: this._createActions(config),
              channelName: channelName,
            },
          ],
        };
      })
      .catch(e => ErrorUtil.defaultErrorHandling(e));
  }

  private static _createActions(config: LegoMessageConfig): Array<any> {
    let options: Array<any> = [];
    for (let i: number = config.min; i <= config.max; i++) {
      options.push({
        text: `${i}`,
        value: i,
      });
    }
    return config.actionDescriptors.map(descriptor =>
      this._legoAction(descriptor, options)
    );
  }

  private static _legoAction(
    descriptor: LegoMessageActionDescriptor,
    options: Array<any>
  ): any {
    return {
      name: `lego-select-option-${descriptor.name}`,
      text: descriptor.text,
      type: 'select',
      options: options,
    };
  }
}

export class LegoMessageConfig {
  actionDescriptors: LegoMessageActionDescriptor[] = [];
  channelName?: string;
  date?: Date = new Date();
  min?: number = 0;
  max?: number = 8;
}

export class LegoMessageActionDescriptor {
  name: string;
  text: string;
  description?: string;
  icon?: string;
}
