import React, { useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { DebugEvent } from "@/state/sessionStore";

interface Props {
  events: DebugEvent[];
}

/**
 * Dev-only onChangeText event log. This is how the phase-0 spike questions
 * (does onChangeText fire per-kana or batched, what happens after ~40
 * uninterrupted chars, does focus survive opacity:0) get answered on a
 * real device, without a separate throwaway project.
 */
export function DebugOverlay({ events }: Props) {
  const [open, setOpen] = useState(false);

  if (!__DEV__) return null;

  return (
    <View className="absolute bottom-0 left-0 right-0">
      <Pressable onPress={() => setOpen((v) => !v)} className="bg-black/70 px-3 py-2">
        <Text className="text-white text-xs">
          {open ? "▼" : "▲"} debug: {events.length} onChangeText events
        </Text>
      </Pressable>
      {open && (
        <ScrollView className="max-h-40 bg-black/85 px-3 py-2">
          {events
            .slice(-40)
            .reverse()
            .map((e, i) => (
              <Text key={i} className="text-green-400 text-xs font-mono">
                +{e.elapsedMs}ms len={e.rawLength}
              </Text>
            ))}
        </ScrollView>
      )}
    </View>
  );
}
