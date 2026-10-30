// Centralized English copy: a future locale can replace this catalogue and document direction.
export const chapters = [
  { id: 'heart', label: 'The living engine', eyebrow: '01 / A rhythm with potential', title: 'Self-Powered\nPacemaker', subtitle: 'Harnessing the Energy of Every Heartbeat', copy: 'Inside every heartbeat is movement. Explore the electrical rhythm that starts it—and the energy that motion could offer.', tag: 'ANATOMY / CONDUCTION' },
  { id: 'comparison', label: 'A different source', eyebrow: '02 / Rethinking the energy source', title: 'Same purpose.\nA new possibility.', subtitle: 'From stored energy to harvested motion', copy: 'Conventional pacemakers use an internal battery. Researchers are exploring how harvested body motion might supplement the energy supply.', tag: 'ESTABLISHED vs EXPERIMENTAL' },
  { id: 'generator', label: 'Inside the material', eyebrow: '03 / The triboelectric nanogenerator', title: 'Small layers.\nRemarkable potential.', subtitle: 'Explore the architecture of a TENG', copy: 'Separate the assembly. Inspect the electrodes, the flexible support, and the interconnected PVDF nanofiber surface.', tag: 'MATERIALS / EXPLODED VIEW' },
  { id: 'simulation', label: 'Make energy move', eyebrow: '04 / Contact. Separate. Repeat.', title: 'Your movement.\nAn electrical response.', subtitle: 'A mechanism you can manipulate', copy: 'Move the triboelectric surfaces yourself. Follow the charges, the changing separation, and the electron flow through the external circuit.', tag: 'INTERACTIVE / SCHEMATIC' },
  { id: 'system', label: 'The complete circuit', eyebrow: '05 / A connected possibility', title: 'The energy\nwithin.', subtitle: 'Turning Human Motion into Electrical Energy', copy: 'Trace a proposed path from cardiac movement to energy conditioning, storage, and pacemaker electronics. Every part has a role.', tag: 'AN EMERGING BIOMEDICAL CONCEPT' },
] as const;
export const stages = [
  { title: 'Contact electrification', short: 'Electrification', text: 'Surface charge can transfer when dissimilar triboelectric materials make contact. The signs shown here are schematic, not a material-specific prediction.' },
  { title: 'Contact between layers', short: 'Contact', text: 'The opposing surfaces are together. Equal and opposite surface charges are illustrated; the separation-dependent potential is low.' },
  { title: 'Separation', short: 'Separation', text: 'As the layers separate, the charge distribution produces a potential difference. Electrons redistribute through the connected external circuit.' },
  { title: 'Electrostatic induction', short: 'Induction', text: 'The changing separation drives charge redistribution between the electrodes. On return toward contact, the illustrative current direction reverses.' },
] as const;
export type InfoId = keyof typeof info;
export const info = {
  heart: { name: 'The human heart', type: 'BIOLOGICAL MOTION', text: 'Contractions of the heart pump blood. The rhythmic deformation is a possible mechanical input to an experimental energy harvester. Click Focus heart to examine the illustrative anatomy.', position: [0, 0, 0.25] },
  aorta: { name: 'Aorta', type: 'ANATOMICAL COMPONENT', text: 'The aorta carries oxygenated blood from the left ventricle into the systemic circulation. Its arch and major branches are simplified in this procedural model.', position: [0.16, 1.3, 0] },
  ventricle: { name: 'Ventricular myocardium', type: 'ANATOMICAL COMPONENT', text: 'Ventricular muscle contracts to eject blood. The visible surface and beat are stylized; chamber geometry, tissue mechanics, and blood flow are not simulated.', position: [0, -0.45, 0.5] },
  sa: { name: 'Sinoatrial (SA) node', type: 'CARDIAC CONDUCTION', text: 'The SA node normally initiates the cardiac electrical impulse in the right atrium. The gold pulse illustrates sequence, not measured propagation speed.', position: [-0.6, 0.75, 0.45] },
  av: { name: 'Atrioventricular (AV) node', type: 'CARDIAC CONDUCTION', text: 'The AV node delays conduction before the impulse travels toward the ventricles through the His–Purkinje system. This pathway is shown schematically on the surface.', position: [-0.1, 0.22, 0.74] },
  pacemaker: { name: 'Pacemaker electronics', type: 'ELECTRICAL STIMULATION', text: 'A conventional pacemaker senses cardiac activity and delivers electrical stimulation when needed. This simplified enclosure and lead are illustrative, not a device specification.', position: [1.3, 1.2, 0.3] },
  battery: { name: 'Internal battery', type: 'ESTABLISHED ENERGY SOURCE', text: 'Conventional implanted pacemakers rely on an internal battery. Emerging energy-harvesting concepts do not remove the battery requirements of existing medical devices.', position: [1.5, 1.05, 0.65] },
  harvester: { name: 'Motion-coupled TENG', type: 'EXPERIMENTAL HARVESTER', text: 'This proposed element illustrates coupling between cardiac motion and a triboelectric generator. Safe attachment, biocompatibility, durability, and usable output would require experimental validation.', position: [0.65, -0.1, 0.7] },
  support: { name: 'Flexible polymer substrate', type: 'LAYER 01 / MECHANICAL SUPPORT', text: 'A compliant support carries the functional layers and transfers deformation. Dimensions and stiffness are intentionally unspecified; this is not an engineered implant design.', position: [0, -0.6, 0] },
  lowerElectrode: { name: 'Lower conductive electrode', type: 'LAYER 02 / CHARGE COLLECTION', text: 'The lower electrode connects to the external circuit. Its free charge redistributes as the triboelectric surfaces move relative to each other.', position: [0, -0.28, 0] },
  counter: { name: 'Counter triboelectric surface', type: 'LAYER 03 / CONTACT PARTNER', text: 'A dissimilar opposing surface forms the triboelectric pair. The reference does not establish a complete material specification, so no specific chemistry or polarity is claimed here.', position: [0, 0, 0] },
  pvdf: { name: 'PVDF nanofiber layer', type: 'LAYER 04 / ACTIVE SURFACE', text: 'Polyvinylidene fluoride (PVDF) can be formed into nanofibers that provide an interconnected contact surface. The fibers here are magnified and stylized, not drawn to scale.', position: [0, 0.48, 0] },
  upperElectrode: { name: 'Upper conductive electrode', type: 'LAYER 05 / CHARGE COLLECTION', text: 'The upper electrode provides the other external circuit connection. Gold color identifies a conductive layer; it does not specify an actual electrode material.', position: [0, 0.78, 0] },
  encapsulation: { name: 'Protective structural layer', type: 'LAYER 06 / ILLUSTRATIVE SUPPORT', text: 'A protective backing completes the schematic assembly. An actual implant would need a validated package that preserves its operation while protecting surrounding tissue.', position: [0, 1.05, 0] },
  conditioning: { name: 'Energy conditioning', type: 'RECTIFICATION / REGULATION', text: 'Triboelectric output is typically variable and alternating. An appropriate conditioning circuit would need to rectify and regulate it before supplying electronics. The board is a schematic visual.', position: [1.65, 0, 0.4] },
  storage: { name: 'Energy storage', type: 'BUFFER BETWEEN CYCLES', text: 'A storage element could buffer intermittent harvested energy. The illustration does not specify a battery chemistry, capacity, or clinically adequate energy supply.', position: [2.2, -1.0, 0.4] },
  meter: { name: 'Schematic measurement', type: 'NORMALIZED RESPONSE / NO UNITS', text: 'The indicator and waveform respond to changing layer separation. They are qualitative teaching aids, not a calibrated electrical model, measured voltage, or medical performance prediction.', position: [1.9, 0, 0] },
} as const;
export const layers: { id: InfoId; color: string; thickness: number }[] = [
  { id: 'support', color: '#2c7184', thickness: .12 },
  { id: 'lowerElectrode', color: '#d0b876', thickness: .035 },
  { id: 'counter', color: '#b4c7cd', thickness: .085 },
  { id: 'pvdf', color: '#e7e7d7', thickness: .07 },
  { id: 'upperElectrode', color: '#cbb572', thickness: .035 },
  { id: 'encapsulation', color: '#7497a5', thickness: .09 },
];
