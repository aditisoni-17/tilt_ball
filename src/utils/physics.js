import { BALL_SIZE, HOLE_SIZE } from "../constants/gameConfig";

export function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

// detect if ball (square/circle) is inside hole (circle)
// ball: {x, y} top-left coords, ballSize
// hole: {x, y} top-left coords, holeSize
export function ballInHole(ballX, ballY, holeX, holeY) {
  const ballRadius = BALL_SIZE / 2;
  const holeRadius = HOLE_SIZE / 2;

  const ballCx = ballX + ballRadius;
  const ballCy = ballY + ballRadius;
  const holeCx = holeX + holeRadius;
  const holeCy = holeY + holeRadius;

  const dx = ballCx - holeCx;
  const dy = ballCy - holeCy;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // require center distance < holeRadius - small margin so ball "fits"
  return dist < Math.max(6, holeRadius - ballRadius * 0.6);
}
