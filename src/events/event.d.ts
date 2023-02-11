export type Event = {
  name: string;
  once?: boolean;
  execute(any);
};
