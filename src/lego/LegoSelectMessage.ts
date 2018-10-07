import { LegoSelectedValue } from './LegoSelectedValue';

export class LegoSelectMessage {
  id: string;
  selectedValues: LegoSelectedValue[] = [];
  channelData: { channelId: string; name: string };
  date: Date = new Date();
}
