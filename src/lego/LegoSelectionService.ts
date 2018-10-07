import { LegoSelectMessage } from './LegoSelectMessage';
import { LegoSelectedValue } from './LegoSelectedValue';
import { LegoSelectedValueEntry } from './LegoSelectedValueEntry';

export class MessageContext {
  fullMessageId: string;
  userData: { userId: string; userName: string };
  action: any;
  channelData: { channelId: string; name: string };
}

export class LegoSelectionService {
  static createLegoSelectMessage(params: {
    legoMessage?: LegoSelectMessage;
    messageContext: MessageContext;
  }): LegoSelectMessage {
    const storedLegoMessage: LegoSelectMessage =
      params.legoMessage || new LegoSelectMessage();

    const messageContext = params.messageContext;
    let selectedValues: LegoSelectedValue[] = this._legoSelectedValues(
      storedLegoMessage.selectedValues || [],
      messageContext
    );

    return {
      id: messageContext.fullMessageId,
      selectedValues: selectedValues,
      channelData: messageContext.channelData,
      date: storedLegoMessage.date,
    };
  }

  private static _legoSelectedValues(
    currentSelectedValues: LegoSelectedValue[] = [],
    messageContext: MessageContext
  ): LegoSelectedValue[] {
    let selectedValues: LegoSelectedValue[] = JSON.parse(
      JSON.stringify(currentSelectedValues)
    );
    let currentAction = messageContext.action;

    let currentSelectedValue: LegoSelectedValue = selectedValues
      .filter(value => value.id == currentAction.name)
      .shift();

    if (!currentSelectedValue) {
      currentSelectedValue = new LegoSelectedValue();
      selectedValues.push(currentSelectedValue);
    }

    currentSelectedValue.id = currentAction.name;

    const userData = messageContext.userData;
    let legoSelectedValueEntry: LegoSelectedValueEntry = currentSelectedValue.entries
      .filter(entry => entry.userData.userId == userData.userId)
      .shift();

    if (!legoSelectedValueEntry) {
      legoSelectedValueEntry = new LegoSelectedValueEntry();
      currentSelectedValue.entries.push(legoSelectedValueEntry);
    }

    legoSelectedValueEntry.userData = userData;
    legoSelectedValueEntry.value = currentAction.selected_options[0].value;

    return selectedValues;
  }
}
