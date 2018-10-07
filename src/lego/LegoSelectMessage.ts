import {LegoSelectedValue} from "./LegoSelectedValue";

export class LegoSelectMessage {
  id: string;
  selectedValues: LegoSelectedValue[] = [];
  channel: string;
  date: Date = new Date();
}