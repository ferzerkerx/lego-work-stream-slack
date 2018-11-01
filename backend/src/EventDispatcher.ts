import {
  AppEvent,
  ApplicationEventEmitter,
  ApplicationEventListener,
} from './lego/Types';

const EventEmitter = require('events');

export class EventDispatcher implements ApplicationEventEmitter {
  private static emitter = new EventEmitter();

  emitEvent(appEvent: AppEvent): void {
    EventDispatcher.emitter.emit('appEvent', appEvent);
  }

  register(listener: ApplicationEventListener): void {
    EventDispatcher.emitter.on('appEvent', appEvent =>
      listener.onEvent(appEvent)
    );
  }
}
