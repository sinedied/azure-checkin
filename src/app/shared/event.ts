export interface Event {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  owner: string;
  usedPasses: number;
  totalPasses: number;
}
