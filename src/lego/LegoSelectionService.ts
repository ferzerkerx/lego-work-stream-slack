import { LegoSelectMessage } from './LegoSelectMessage';
import { LegoSelectedValue } from './LegoSelectedValue';
import { LegoSelectedValueEntry } from './LegoSelectedValueEntry';

export class LegoSelectionService {
  static createLegoSelectMessage(params: {
    legoMessage?: LegoSelectMessage;
    fullMessageId: string;
    user: string;
    action: any;
    channel: string;
  }): LegoSelectMessage {
    const storedLegoMessage: LegoSelectMessage =
      params.legoMessage || new LegoSelectMessage();
    let selectedValues: LegoSelectedValue[] = this._legoSelectedValues(
      storedLegoMessage.selectedValues || [],
      params.user,
      params.action
    );

    return {
      id: params.fullMessageId,
      selectedValues: selectedValues,
      channel: params.channel,
      date: storedLegoMessage.date,
    };
  }

  private static _legoSelectedValues(
    currentSelectedValues: LegoSelectedValue[] = [],
    user,
    action
  ): LegoSelectedValue[] {
    let selectedValues: LegoSelectedValue[] = JSON.parse(JSON.stringify(currentSelectedValues));
    let currentAction = action;

    let currentSelectedValue: LegoSelectedValue = selectedValues
      .filter(value => value.id == currentAction.name)
      .shift();

    if (!currentSelectedValue) {
      currentSelectedValue = new LegoSelectedValue();
      selectedValues.push(currentSelectedValue);
    }

    currentSelectedValue.id = currentAction.name;

    let legoSelectedValueEntry: LegoSelectedValueEntry = currentSelectedValue.entries
      .filter(entry => entry.user == user)
      .shift();

    if (!legoSelectedValueEntry) {
      legoSelectedValueEntry = new LegoSelectedValueEntry();
      currentSelectedValue.entries.push(legoSelectedValueEntry);
    }

    legoSelectedValueEntry.user = user;
    legoSelectedValueEntry.value = currentAction.selected_options[0].value;

    return selectedValues;
  }
}
