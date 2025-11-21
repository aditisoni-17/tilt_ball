import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

import useAccelerometer from "../hooks/useAccelerometer";
import Ball from "../components/Ball";
import Hole from "../components/Hole";
import HUD from "../components/HUD";
import {
  SCREEN,
  BALL_SIZE,
  HOLE_SIZE,
  UPDATE_MS,
  ACCEL_SENSITIVITY,
  FRICTION,
  MAX_SPEED,
  ROUND_TIME_SECONDS,
} from "../constants/gameConfig";
import { clamp, ballInHole } from "../utils/physics";

const { width: SCREEN_W, height: SCREEN_H } = SCREEN;

export default function GameScreen() {
  const acc = useAccelerometer(UPDATE_MS);
  const [ballPos, setBallPos] = useState({
    x: SCREEN_W / 2 - BALL_SIZE / 2,
    y: SCREEN_H / 2 - BALL_SIZE / 2,
  });
  const velRef = useRef({ vx: 0, vy: 0 });
  const [holePos, setHolePos] = useState(() =>
    randomHolePosition()
  );

  const [running, setRunning] = useState(true);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME_SECONDS);
  const [score, setScore] = useState(0);
  const [roundOver, setRoundOver] = useState(false);
  const loopRef = useRef(null);
  const timerRef = useRef(null);

  // Game loop
  useEffect(() => {
    startLoop();
    startTimer();

    return () => {
      stopLoop();
      stopTimer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // responds to running toggle
  useEffect(() => {
    if (running) {
      startLoop();
      startTimer();
    } else {
      stopLoop();
      stopTimer();
    }
  }, [running]);

  // main physics loop
  function startLoop() {
    if (loopRef.current) return;
    loopRef.current = setInterval(() => {
      // update only if running and not roundOver
      if (!running || roundOver) return;

      // accelerometer axes: acc.x is left-right tilt; acc.y is up-down tilt (device dependent)
      // mapping: tilt device forward (acc.y positive) should move ball up visually? We'll map natural feel:
      // moveX uses acc.x (left-right), moveY uses acc.y (up-down) inverted for screen coords.
      const ax = acc.x || 0;
      const ay = acc.y || 0;

      // convert accel to velocity change
      velRef.current.vx += (-ax * ACCEL_SENSITIVITY) * (UPDATE_MS / 1000);
      velRef.current.vy += (ay * ACCEL_SENSITIVITY) * (UPDATE_MS / 1000);

      // apply friction
      velRef.current.vx *= FRICTION;
      velRef.current.vy *= FRICTION;

      // clamp
      velRef.current.vx = clamp(velRef.current.vx, -MAX_SPEED, MAX_SPEED);
      velRef.current.vy = clamp(velRef.current.vy, -MAX_SPEED, MAX_SPEED);

      // update position
      setBallPos((prev) => {
        let nx = prev.x + velRef.current.vx;
        let ny = prev.y + velRef.current.vy;

        // collision with screen edges (bounce)
        if (nx < 0) {
          nx = 0;
          velRef.current.vx *= -0.4;
        } else if (nx > SCREEN_W - BALL_SIZE) {
          nx = SCREEN_W - BALL_SIZE;
          velRef.current.vx *= -0.4;
        }

        if (ny < 0) {
          ny = 0;
          velRef.current.vy *= -0.4;
        } else if (ny > SCREEN_H - BALL_SIZE) {
          ny = SCREEN_H - BALL_SIZE;
          velRef.current.vy *= -0.4;
        }

        // detect hole
        if (ballInHole(nx, ny, holePos.x, holePos.y)) {
          // scored
          handleScore();
        }

        return { x: nx, y: ny };
      });
    }, UPDATE_MS);
  }

  function stopLoop() {
    if (loopRef.current) {
      clearInterval(loopRef.current);
      loopRef.current = null;
    }
  }

  // timer
  function startTimer() {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => {
      if (!running || roundOver) return;
      setTimeLeft((t) => {
        if (t <= 1) {
          // time up
          setRoundOver(true);
          setRunning(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  function stopTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function handleScore() {
    // Award points, respawn hole, small pause
    setScore((s) => s + Math.max(1, Math.floor(timeLeft / 2)));
    setRoundOver(true);
    setRunning(false);

    // small celebration: after 900ms, respawn
    setTimeout(() => {
      setHolePos(randomHolePosition());
      // reset ball to center slowly
      setBallPos({
        x: SCREEN_W / 2 - BALL_SIZE / 2,
        y: SCREEN_H / 2 - BALL_SIZE / 2,
      });
      velRef.current = { vx: 0, vy: 0 };
      setTimeLeft(ROUND_TIME_SECONDS);
      setRoundOver(false);
      setRunning(true);
    }, 900);
  }

  function onRestart() {
    setScore(0);
    setTimeLeft(ROUND_TIME_SECONDS);
    setBallPos({ x: SCREEN_W / 2 - BALL_SIZE / 2, y: SCREEN_H / 2 - BALL_SIZE / 2 });
    velRef.current = { vx: 0, vy: 0 };
    setHolePos(randomHolePosition());
    setRoundOver(false);
    setRunning(true);
  }

  function onTogglePause() {
    setRunning((r) => !r);
  }

  return (
    <View style={styles.container}>
      <View style={styles.playArea}>
        <Hole x={holePos.x} y={holePos.y} />
        <Ball x={ballPos.x} y={ballPos.y} />

        {/* overlay messages */}
        {roundOver && (
          <View style={styles.centerMessage}>
            <Text style={styles.winText}>Nice! +{Math.max(1, Math.floor(timeLeft / 2))}</Text>
            <Text style={styles.smallText}>Preparing next round...</Text>
          </View>
        )}

        {!running && !roundOver && (
          <View style={styles.centerMessage}>
            <Text style={styles.winText}>Paused</Text>
            <Text style={styles.smallText}>Tap Resume to continue</Text>
          </View>
        )}

        {timeLeft === 0 && !roundOver && (
          <View style={styles.centerMessage}>
            <Text style={styles.loseText}>Time's Up</Text>
            <Text style={styles.smallText}>Press Restart to try again</Text>
          </View>
        )}
      </View>

      <HUD
        score={score}
        timeLeft={timeLeft}
        onRestart={onRestart}
        running={running}
        onTogglePause={onTogglePause}
      />
    </View>
  );
}

function randomHolePosition() {
  // place hole somewhere comfortably inside screen bounds
  const margin = 48;
  const x = Math.random() * (SCREEN_W - HOLE_SIZE - margin * 2) + margin;
  const y = Math.random() * (SCREEN_H - HOLE_SIZE - margin * 2) + margin + 40; // leave HUD space
  return { x, y };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#08111a",
  },
  playArea: {
    flex: 1,
    backgroundColor: "#0b2730",
    marginTop: 0,
  },
  centerMessage: {
    position: "absolute",
    left: 20,
    right: 20,
    top: "42%",
    alignItems: "center",
    backgroundColor: "#00000066",
    padding: 16,
    borderRadius: 12,
  },
  winText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },
  loseText: {
    color: "#ff7777",
    fontSize: 32,
    fontWeight: "800",
  },
  smallText: {
    color: "#ddd",
    fontSize: 14,
    marginTop: 8,
  },
});
