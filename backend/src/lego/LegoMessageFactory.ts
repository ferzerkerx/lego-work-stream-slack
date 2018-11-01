import { SlackMessage } from 'botkit';
import { DateUtils } from '../utils/DateUtils';

export class LegoMessageFactory {
  static defaultConfiguration(channelName: string): TeamChannelConfiguration {
    return {
      channelName: channelName,
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
    config: TeamChannelConfiguration,
    date: Date = new Date()
  ): SlackMessage {
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
        },
      ],
      channel: config.channelName,
    };
  }

  private static _createActions(config: TeamChannelConfiguration): Array<any> {
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

export class TeamChannelConfiguration {
  actionDescriptors: LegoMessageActionDescriptor[] = [];
  channelName: string;
  date?: Date = new Date();
  min?: number = 0;
  max?: number = 8;
  cronExpression?: string;
}

export class LegoMessageActionDescriptor {
  name: string;
  text: string;
  description?: string;
  icon?: string;
}
