export type Chapter = {
  id: number;
  code: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  description: string;
  insight: string;
  sceneTag: string;
};

export const chapters: Chapter[] = [
  {
    id: 0,
    code: '01',
    eyebrow: 'THE CARDIAC SIGNAL',
    title: 'Self-Powered Pacemaker',
    subtitle: 'Harnessing the energy of every heartbeat.',
    description: 'Begin with the heart: a living electrical system whose rhythm may one day help power the technology that supports it.',
    insight: 'The heart’s natural conduction system starts each beat and coordinates its spread through the myocardium.',
    sceneTag: 'ANATOMY / SIGNAL',
  },
  {
    id: 1,
    code: '02',
    eyebrow: 'A DIFFERENT ENERGY SOURCE',
    title: 'From battery to motion',
    subtitle: 'Two approaches. One vital rhythm.',
    description: 'Explore how a conventional pacemaker delivers electrical stimulation, then compare it with an experimental motion-harvesting concept.',
    insight: 'Implanted pacemakers in clinical use are established medical devices. TENG-assisted systems remain an emerging research concept.',
    sceneTag: 'COMPARISON / CONCEPT',
  },
  {
    id: 2,
    code: '03',
    eyebrow: 'THE MATERIAL STACK',
    title: 'A generator in layers',
    subtitle: 'Flexible materials. Microscale contact.',
    description: 'Separate the conductive electrodes, PVDF nanofiber layer and flexible support to inspect the structure behind the concept.',
    insight: 'PVDF is a polymer with piezoelectric properties; here, its nanofiber surface is shown as part of an illustrative triboelectric design.',
    sceneTag: 'TENG / EXPLODED VIEW',
  },
  {
    id: 3,
    code: '04',
    eyebrow: 'THE GENERATION CYCLE',
    title: 'Contact. Separate. Induce.',
    subtitle: 'Move the layers and follow the charge.',
    description: 'Drive the surfaces by hand. Watch charge distributions, electron flow and a synchronized schematic waveform respond to the gap.',
    insight: 'The waveform communicates the cycle only. It is schematic and does not represent measured voltage, power or medical performance.',
    sceneTag: 'INTERACTIVE / SIMULATION',
  },
  {
    id: 4,
    code: '05',
    eyebrow: 'BIOLOGICAL MOTION → ELECTRICAL ENERGY',
    title: 'Turning human motion into electrical energy',
    subtitle: 'A research concept, explored in three dimensions.',
    description: 'Trace a proposed path from heartbeat motion through mechanical coupling, energy conditioning and storage to pacemaker electronics.',
    insight: 'This is an educational visualization of an emerging biomedical concept, not a clinically validated device design.',
    sceneTag: 'SYSTEM / CONCEPT',
  },
];

export const components = {
  sa: {
    title: 'Sinoatrial node',
    description: 'A cluster of cells in the right atrium that normally initiates the heart’s electrical impulse.',
  },
  av: {
    title: 'Atrioventricular node',
    description: 'The impulse passes through this junction before traveling into the ventricles.',
  },
  conduction: {
    title: 'Ventricular conduction',
    description: 'Specialized pathways carry the impulse through the ventricles, coordinating contraction.',
  },
  battery: {
    title: 'Battery-powered pulse generator',
    description: 'A conventional pacemaker uses an implanted pulse generator and leads to deliver carefully controlled stimulation when needed.',
  },
  lead: {
    title: 'Stimulation lead',
    description: 'A lead conducts therapeutic electrical pulses from the pulse generator to heart tissue.',
  },
  electrode: {
    title: 'Conductive electrodes',
    description: 'Flexible conductive layers collect and transfer charge during contact and separation.',
  },
  pvdf: {
    title: 'PVDF nanofiber layer',
    description: 'A fibrous polymer surface is represented here to illustrate how microstructure can increase real contact area.',
  },
  substrate: {
    title: 'Flexible polymer support',
    description: 'A compliant substrate supports the stack and allows it to move with a mechanical input.',
  },
  storage: {
    title: 'Energy conditioning & storage',
    description: 'A proposed conditioning stage would regulate and store harvested energy before it could be used by electronics.',
  },
  electronics: {
    title: 'Pacemaker electronics',
    description: 'The block represents a hypothetical interface to pacing electronics. It does not model a validated clinical circuit.',
  },
};
