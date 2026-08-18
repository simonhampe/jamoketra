import React, { useEffect, useRef } from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSessionStore, DEFAULT_SESSION_MODE } from "@/state/sessionStore";
import { HiddenKanaInput, HiddenKanaInputHandle } from "@/ui/input/HiddenKanaInput";
import { KanaDisplay } from "@/ui/input/KanaDisplay";
import { DebugOverlay } from "@/ui/input/DebugOverlay";

export default function Play() {
  const router = useRouter();
  const inputRef = useRef<HiddenKanaInputHandle>(null);

  const status = useSessionStore((s) => s.status);
  const comparison = useSessionStore((s) => s.comparison);
  const elapsedMs = useSessionStore((s) => s.elapsedMs);
  const debugEvents = useSessionStore((s) => s.debugEvents);
  const startSession = useSessionStore((s) => s.startSession);
  const onBufferChange = useSessionStore((s) => s.onBufferChange);
  const tick = useSessionStore((s) => s.tick);
  const reset = useSessionStore((s) => s.reset);

  useEffect(() => {
    startSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const interval = setInterval(tick, 200);
    return () => clearInterval(interval);
  }, [tick]);

  useEffect(() => {
    if (status === "finished") {
      inputRef.current?.blurAndClear();
      router.replace("/results");
    }
  }, [status, router]);

  useEffect(() => {
    return () => reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const secondsLeft =
    DEFAULT_SESSION_MODE.type === "time"
      ? Math.max(0, DEFAULT_SESSION_MODE.seconds - Math.floor(elapsedMs / 1000))
      : null;
  const errorCount = comparison?.errorCount ?? 0;

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <Pressable className="flex-1" onPress={() => inputRef.current?.focus()}>
        <View className="flex-row justify-between px-6 pt-4">
          <Text className="text-lg font-mono text-black dark:text-white">{secondsLeft !== null ? `${secondsLeft}s` : ""}</Text>
          <Text className="text-lg font-mono text-red-600 dark:text-red-400">errors: {errorCount}</Text>
        </View>
        <View className="flex-1 justify-center items-center px-4">
          {comparison && <KanaDisplay comparison={comparison} />}
        </View>
      </Pressable>
      <HiddenKanaInput ref={inputRef} onChangeText={onBufferChange} />
      <DebugOverlay events={debugEvents} />
    </SafeAreaView>
  );
}
