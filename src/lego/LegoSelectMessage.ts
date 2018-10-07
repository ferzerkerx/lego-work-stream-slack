import { LegoSelectedValue } from './LegoSelectedValue';
import { Utils } from '../Utils';

export class LegoSelectMessage {
  id: string;
  selectedValues: LegoSelectedValue[] = [];
  channelData: { channelId: string; name: string };
  date: Date = Utils.now();
}
