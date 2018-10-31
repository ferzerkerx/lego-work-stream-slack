import {
  LegoMessageFactory,
  TeamChannelConfiguration,
} from './LegoMessageFactory';
import { SlackBot, SlackMessage } from 'botkit';
import * as cronParser from 'cron-parser';
import { LegoScheduler, TeamChannelConfigurationRepository } from './Types';

class ScheduleContext {
  configuration: TeamChannelConfiguration;
  bot: SlackBot;
  scheduleNext: Function;
}

export class LegoSchedulerImpl implements LegoScheduler {
  private started: boolean = false;
  private dateTimesByChannel: any = {};
  constructor(
    private teamChannelConfigurationRepository: TeamChannelConfigurationRepository
  ) {}
  public start(bot: SlackBot) {
    if (!this.started) {
      this.dateTimesByChannel = {};
      this.scheduleIfNeeded(bot);
    }
    this.started = true;
  }

  private scheduleIfNeeded(bot: SlackBot): void {
    const { dateTimesByChannel } = this;
    this.teamChannelConfigurationRepository
      .findAll()
      .then((configurations: TeamChannelConfiguration[]) => {
        if (configurations && configurations.length > 0) {
          for (let configuration of configurations) {
            this.scheduleForConfig(dateTimesByChannel, configuration, bot);
          }
        }
      });
  }

  private scheduleForConfig(
    dateTimesByChannel: any,
    configuration,
    bot: SlackBot
  ): void {
    if (dateTimesByChannel[configuration.channelName]) {
      dateTimesByChannel[configuration.channelName].foreach(timeoutObj => {
        clearTimeout(timeoutObj);
      });
    }

    if (!configuration.cronExpression) {
      return;
    }

    const scheduleContext = this.createContext(configuration, bot);
    const nextTriggerInMillis = LegoSchedulerImpl.nextTriggerInMillis(
      configuration.cronExpression
    );
    if (isNaN(nextTriggerInMillis)) {
      return;
    }
    const timeoutObj = setTimeout(
      LegoSchedulerImpl.sendScheduledMessage,
      nextTriggerInMillis,
      scheduleContext
    );
    dateTimesByChannel[configuration.channelName] = [timeoutObj];
  }

  private createContext(configuration, bot: SlackBot): ScheduleContext {
    const { dateTimesByChannel, scheduleForConfig } = this;
    return {
      configuration,
      scheduleNext: () => {
        scheduleForConfig(dateTimesByChannel, configuration, bot);
      },
      bot,
    };
  }

  private static nextTriggerInMillis(cronExpression): number {
    const interval = cronParser.parseExpression(cronExpression);
    const nextDate = interval.next().toDate();
    const now = new Date();
    return nextDate.getUTCMilliseconds() - now.getUTCMilliseconds();
  }

  private static sendScheduledMessage(scheduleContext: ScheduleContext): void {
    const { bot, configuration } = scheduleContext;
    const message: SlackMessage = LegoMessageFactory.createMessage(
      configuration,
      new Date()
    );
    bot.say(message);
    scheduleContext.scheduleNext();
  }
}
