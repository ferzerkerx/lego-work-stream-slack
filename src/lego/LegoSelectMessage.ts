import { LegoSelectedValue } from './LegoSelectedValue';
import { DateUtils } from '../utils/DateUtils';

export class LegoSelectMessage {
  id: string;
  selectedValues: LegoSelectedValue[] = [];
  channelData: { channelId: string; name: string };
  date: Date = DateUtils.now();
}
