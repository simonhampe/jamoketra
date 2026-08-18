import React from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSessionStore } from "@/state/sessionStore";

export default function Results() {
  const router = useRouter();
  const summary = useSessionStore((s) => s.summary);
  const reset = useSessionStore((s) => s.reset);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <View className="flex-1 justify-center items-center px-8 gap-4">
        <Text className="text-3xl font-bold mb-4 text-black dark:text-white">Round complete</Text>

        {summary ? (
          <>
            <Stat
              label="Words correct"
              value={`${summary.wordsCorrect}/${summary.wordsCompleted}`}
            />
            <Stat label="Words completed" value={String(summary.wordsCompleted)} />
            <Stat label="Morae / sec" value={summary.moraePerSecond.toFixed(2)} />
            <Stat label="Accuracy" value={`${Math.round(summary.accuracy * 100)}%`} />
            <Stat label="Errors" value={String(summary.totalErrors)} />
          </>
        ) : (
          <Text className="text-gray-500 dark:text-gray-400">No summary available.</Text>
        )}

        <Pressable
          className="bg-black dark:bg-white rounded-full px-8 py-4 mt-8"
          onPress={() => {
            reset();
            router.replace("/play");
          }}
        >
          <Text className="text-white dark:text-black text-lg font-semibold">Play again</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            reset();
            router.replace("/");
          }}
        >
          <Text className="text-gray-500 dark:text-gray-400 text-base mt-2">Back to start</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between w-full">
      <Text className="text-base text-gray-600 dark:text-gray-300">{label}</Text>
      <Text className="text-base font-semibold text-black dark:text-white">{value}</Text>
    </View>
  );
}
