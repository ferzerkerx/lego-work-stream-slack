import { SlackBot, SlackController, SlackSpawnConfiguration } from 'botkit';
import { ApplicationEventListener } from '../ApplicationEventListener';
import { RtmManager } from '../RtmManager';

const createRtmManager = (controller: SlackController): any => {
  const manager = new RtmManager();

  // @ts-ignore
  controller.on('rtm:start', (config: SlackSpawnConfiguration) => {
    const bot: SlackBot = controller.spawn(config);

    manager.start(bot).then(() => {
      ApplicationEventListener.onCommunicationChannelEstablished(
        bot,
        controller
      );
    });
  });

  //
  controller.on('rtm_close', bot => {
    manager.remove(bot);
  });

  return manager;
};
module.exports = createRtmManager;
