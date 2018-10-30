import {
  LegoMessageFactory,
  TeamChannelConfiguration,
} from './LegoMessageFactory';
import { SlackBot, SlackMessage } from 'botkit';
import { LegoScheduler, TeamChannelConfigurationRepository } from './Types';

const MINUTE_IN_MILLIS = 1000 * 60;

export class LegoSchedulerImpl implements LegoScheduler {
  private started: boolean = false;
  constructor(
    private teamChannelConfigurationRepository: TeamChannelConfigurationRepository
  ) {}
  public start(bot: SlackBot) {
    if (!this.started) {
      setInterval(() => {
        this.sendScheduleMessage(bot);
      }, MINUTE_IN_MILLIS * 15);
    }
    this.started = true;
  }

  private sendScheduleMessage(bot: SlackBot): void {
    this.teamChannelConfigurationRepository
      .findAll()
      .then((configurations: TeamChannelConfiguration[]) => {
        if (configurations && configurations.length > 0) {
          for (let configuration of configurations) {
            if (configuration) {
              //TODO check if configuration should be sent for this team against time in config
              const message: SlackMessage = LegoMessageFactory.createMessage(
                configuration,
                new Date()
              );
              bot.say(message);
            }
          }
        }
      });
  }
}
