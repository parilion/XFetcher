import { buildWindowLabel } from "../../lib/time";

export type SchedulerWindow = {
  hours: number;
  label: string;
};

export function createSchedulerWindow(hours: number): SchedulerWindow {
  return {
    hours,
    label: buildWindowLabel(hours),
  };
}
