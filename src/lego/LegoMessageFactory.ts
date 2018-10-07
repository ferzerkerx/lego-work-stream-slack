import { SlackMessage } from 'botkit';

export class LegoMessageFactory {
  static createMessage(config: LegoMessageConfig): SlackMessage {
    return {
      text: `Please select your Legos for today ${this.toPrettyDate(
        config.date.toDateString()
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

  private static toPrettyDate(theValue: string): string {
    let theDate: Date = new Date(theValue),
      month = '' + (theDate.getMonth() + 1),
      day = '' + theDate.getDate(),
      year = theDate.getFullYear();

    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    return [year, month, day].join('-');
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
