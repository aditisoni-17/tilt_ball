import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

export const SCREEN = { width, height };
export const BALL_SIZE = 48; // pixels
export const HOLE_SIZE = 72; // pixels (diameter)
export const UPDATE_MS = 16; // ~60 FPS
export const ACCEL_SENSITIVITY = 18; // multiplier for accelerometer -> velocity
export const FRICTION = 0.98; // per frame damping
export const MAX_SPEED = 25; // clamp speed
export const ROUND_TIME_SECONDS = 25; // time per round
