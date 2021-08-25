export interface Event {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  owner: string;
  locked: boolean;
  archived: boolean;
  usedPasses: number;
  totalPasses: number;
  passes?: { [key: string]: string };
}
