export type Participant = {
  id: string;
  name: string;
  solsticeId: string;
  team: string;
  isCaptain?: boolean;
  present: boolean;
};

export type Event = {
  id: string;
  name: string;
  category: string;
  participants: Participant[];
};
