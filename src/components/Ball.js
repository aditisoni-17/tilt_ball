import React from "react";
import { View } from "react-native";
import { BALL_SIZE } from "../constants/gameConfig";

export default function Ball({ x, y }) {
  return (
    <View
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: BALL_SIZE,
        height: BALL_SIZE,
        borderRadius: BALL_SIZE / 2,
        backgroundColor: "#00d1ff",
        borderWidth: 3,
        borderColor: "#005b6b",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.35,
        elevation: 6,
      }}
    />
  );
}
