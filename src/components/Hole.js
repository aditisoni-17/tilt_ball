import React from "react";
import { View } from "react-native";
import { HOLE_SIZE } from "../constants/gameConfig";

export default function Hole({ x, y }) {
  return (
    <View
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: HOLE_SIZE,
        height: HOLE_SIZE,
        borderRadius: HOLE_SIZE / 2,
        backgroundColor: "#094b08",
        borderWidth: 4,
        borderColor: "#0fc114",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: HOLE_SIZE * 0.58,
          height: HOLE_SIZE * 0.58,
          borderRadius: (HOLE_SIZE * 0.58) / 2,
          backgroundColor: "#021d01",
        }}
      />
    </View>
  );
}
