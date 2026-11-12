import { TimeCrystal, Checkpoint } from '../types/game';

export const INITIAL_CRYSTALS: TimeCrystal[] = [
  {
    id: 'crystal-1',
    name: 'Spark of Chronos',
    zone: 'Courtyard of Hours',
    description: 'Found resting atop the ancient sundial altar.',
    x: 0,
    y: 2.2,
    z: -35,
    collected: false,
    color: '#06B6D4' // Electric Cyan
  },
  {
    id: 'crystal-2',
    name: 'Gear of Eternity',
    zone: 'Gearworks of Chronos',
    description: 'Guarded by rotating clockwork mechanisms and pendulum blades.',
    x: 14,
    y: 3.8,
    z: -85,
    collected: false,
    color: '#F59E0B' // Golden Amber
  },
  {
    id: 'crystal-3',
    name: 'Rift Prism',
    zone: 'The Temporal Abyss',
    description: 'Only accessible when stepping through the veil into the ancient Past.',
    x: -14,
    y: 5.2,
    z: -142,
    collected: false,
    color: '#A855F7' // Temporal Violet
  },
  {
    id: 'crystal-4',
    name: 'Heart of the Colossus',
    zone: "The Guardian's Crucible",
    description: 'Vanquish the ancient Stone Guardian in the inner sanctum to claim.',
    x: 0,
    y: 3.0,
    z: -210,
    collected: false,
    color: '#10B981' // Emerald Radiance
  }
];

export const INITIAL_CHECKPOINTS: Checkpoint[] = [
  {
    id: 'cp-entrance',
    name: 'Temple Entrance',
    x: 0,
    y: 1.0,
    z: -5,
    active: true
  },
  {
    id: 'cp-gearworks',
    name: 'Gearworks Gateway',
    x: 0,
    y: 1.0,
    z: -58,
    active: false
  },
  {
    id: 'cp-rift',
    name: 'Temporal Rift Edge',
    x: 0,
    y: 2.0,
    z: -115,
    active: false
  },
  {
    id: 'cp-sanctum',
    name: 'Sanctum Antechamber',
    x: 0,
    y: 1.0,
    z: -168,
    active: false
  }
];

export const PHYSICS = {
  GRAVITY: -28.0,
  MOVE_SPEED: 9.5,
  RUN_SPEED: 13.0,
  JUMP_FORCE: 11.5,
  PLAYER_RADIUS: 0.6,
  PLAYER_HEIGHT: 1.8,
  TIME_FREEZE_DURATION: 5.0, // seconds
  TIME_SHIELD_DURATION: 4.0, // seconds
  VOID_RESPAWN_Y: -15.0
};

export const GESTURE_MAP = {
  OPEN_PALM: 'Run Forward',
  TWO_FINGERS: 'Jump Up',
  FIST: 'Attack / Strike',
  THUMBS_UP: 'Temporal Shield',
  BOTH_PALMS: 'Freeze Time',
  BOTH_HANDS_RAISED: 'Rewind Timeline'
};
