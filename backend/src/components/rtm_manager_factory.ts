import { SlackBot, SlackController, SlackSpawnConfiguration } from 'botkit';
import { RtmManager } from '../RtmManager';
import { AppEvent, AppEventTypes } from '../lego/Types';
import { ServiceLocator } from '../ServiceLocator';

const createRtmManager = (controller: SlackController): any => {
  const manager = new RtmManager();

  // @ts-ignore
  controller.on('rtm:start', (config: SlackSpawnConfiguration) => {
    const bot: SlackBot = controller.spawn(config);

    manager.start(bot).then(() => {
      const appEvent: AppEvent = {
        name: AppEventTypes.STARTED,
        data: { bot: bot, controller: controller },
      };
      ServiceLocator.getEventDispatcher().emitEvent(appEvent);
    });
  });

  //
  controller.on('rtm_close', bot => {
    manager.remove(bot);
  });

  return manager;
};

module.exports = createRtmManager;
