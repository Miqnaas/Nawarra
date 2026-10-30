export type SelectPart = (
  id: string,
  title: string,
  description: string,
  focus: [number, number, number],
) => void;

export type SceneProps = {
  paused: boolean;
  onSelect: SelectPart;
  selectedId?: string | null;
  conduction?: boolean;
  comparisonMode?: 'conventional' | 'experimental';
};
