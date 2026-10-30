export type SimulationSample = { separation: number; response: number; stage: number; charged: boolean; time: number };
export const cycleLength = 12;
/** Qualitative kinematics only. No voltage, charge, power, or medical performance units. */
export function sampleCycle(time: number): SimulationSample {
  const t = ((time % cycleLength) + cycleLength) % cycleLength;
  const stage = Math.min(3, Math.floor(t / 3));
  const local = (t % 3) / 3;
  const eased = (1 - Math.cos(local * Math.PI)) / 2;
  return {
    time,
    stage,
    charged: t > .7,
    separation: stage < 2 ? 0 : stage === 2 ? eased : 1 - eased,
    response: stage < 2 ? 0 : (stage === 2 ? 1 : -1) * Math.sin(local * Math.PI),
  };
}
export function manualResponse(previous: number, next: number, elapsedSeconds: number) {
  if (elapsedSeconds <= 0 || !Number.isFinite(elapsedSeconds)) return 0;
  return Math.max(-1, Math.min(1, (next - previous) / Math.max(.08, elapsedSeconds) * .6));
}
