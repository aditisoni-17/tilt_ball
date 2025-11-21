import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function HUD({
  score,
  timeLeft,
  onRestart,
  running,
  onTogglePause,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Score: {score}</Text>
      <Text style={styles.text}>Time: {timeLeft}s</Text>

      <View style={styles.right}>
        <TouchableOpacity style={styles.btn} onPress={onTogglePause}>
          <Text style={styles.btnText}>{running ? "Pause" : "Resume"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.btn, { marginLeft: 8 }]} onPress={onRestart}>
          <Text style={styles.btnText}>Restart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 12,
    right: 12,
    top: 36,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 50,
  },
  text: { color: "white", fontSize: 18 },
  right: { flexDirection: "row", alignItems: "center" },
  btn: {
    backgroundColor: "#ffffff22",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  btnText: { color: "white", fontSize: 14 },
});
