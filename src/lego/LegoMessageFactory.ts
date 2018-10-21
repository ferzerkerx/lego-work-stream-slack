import { SlackMessage } from 'botkit';
import { DateUtils } from '../utils/DateUtils';

export class LegoMessageFactory {
  static createMessage(
    config: LegoMessageConfig,
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
    };
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
