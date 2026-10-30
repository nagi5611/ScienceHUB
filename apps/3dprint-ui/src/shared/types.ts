export type Kind = 'request' | 'reserve';
export type UiStatus = 'pending' | 'approved' | 'rejected' | 'done';

export type Who = { name: string; hr: string; num: string };

export type Application = {
  id: string;
  date: string;
  machine: 'ke' | 'cc';
  kind: Kind;
  start: number;
  end: number;
  title: string;
  file: string;
  fileSize?: number;
  note: string;
  who: Who;
  status: UiStatus;
  mine?: boolean;
  createdAt?: string;
  printer_id?: string;
};

export type MachineId = 'ke' | 'cc';
