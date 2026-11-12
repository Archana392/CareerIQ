export type GameScreen = 'title' | 'playing' | 'paused' | 'gameover' | 'victory';

export type TimeDimension = 'present' | 'past';

export type PlayerAction = 'idle' | 'running' | 'jumping' | 'falling' | 'attacking' | 'shield' | 'magic_cast' | 'hit';

export interface TimeCrystal {
  id: string;
  name: string;
  zone: string;
  description: string;
  x: number;
  y: number;
  z: number;
  collected: boolean;
  color: string;
}

export interface Checkpoint {
  id: string;
  name: string;
  x: number;
  y: number;
  z: number;
  active: boolean;
}

export interface BossState {
  name: string;
  maxHealth: number;
  health: number;
  phase: number;
  isStunned: boolean;
  stunTimer: number;
  isAttacking: boolean;
  attackCooldown: number;
  attackType: 'stomp' | 'slam' | 'temporal_wave' | 'none';
  x: number;
  y: number;
  z: number;
  rotation: number;
  defeated: boolean;
}

export interface HandGestureResult {
  gesture: 'open_palm' | 'two_fingers' | 'fist' | 'thumbs_up' | 'both_palms' | 'both_hands_raised' | 'none';
  confidence: number;
  handsCount: number;
  rawLeftGesture?: string;
  rawRightGesture?: string;
  timestamp: number;
}

export interface GameState {
  screen: GameScreen;
  dimension: TimeDimension;
  health: number;
  maxHealth: number;
  timeEnergy: number;
  maxTimeEnergy: number;
  crystals: TimeCrystal[];
  checkpoints: Checkpoint[];
  currentCheckpointId: string;
  isTimeFrozen: boolean;
  timeFrozenRemaining: number;
  isRewinding: boolean;
  isShieldActive: boolean;
  shieldRemaining: number;
  boss: BossState;
  score: number;
  elapsedTime: number;
  activeGesture: HandGestureResult;
  webcamEnabled: boolean;
  webcamReady: boolean;
  audioMuted: boolean;
  clockPuzzleSolved: boolean;
  clockAngle: number;
  targetClockAngle: number;
  doorOpen: boolean;
  notificationMessage: string | null;
  notificationType: 'info' | 'success' | 'warning' | 'danger';
}

export interface PlayerInputState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  attack: boolean;
  shield: boolean;
  timeFreeze: boolean;
  timeRewind: boolean;
  dimensionShift: boolean;
}

export interface RecordedState {
  x: number;
  y: number;
  z: number;
  rotationY: number;
  action: PlayerAction;
  health: number;
  timeEnergy: number;
  dimension: TimeDimension;
}
