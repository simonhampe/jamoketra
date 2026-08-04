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
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-8 gap-4">
        <Text className="text-3xl font-bold mb-4">Round complete</Text>

        {summary ? (
          <>
            <Stat label="Words completed" value={String(summary.wordsCompleted)} />
            <Stat label="Morae / sec" value={summary.moraePerSecond.toFixed(2)} />
            <Stat label="Accuracy" value={`${Math.round(summary.accuracy * 100)}%`} />
            <Stat label="Errors" value={String(summary.totalErrors)} />
          </>
        ) : (
          <Text className="text-gray-500">No summary available.</Text>
        )}

        <Pressable
          className="bg-black rounded-full px-8 py-4 mt-8"
          onPress={() => {
            reset();
            router.replace("/play");
          }}
        >
          <Text className="text-white text-lg font-semibold">Play again</Text>
        </Pressable>
        <Pressable
          onPress={() => {
            reset();
            router.replace("/");
          }}
        >
          <Text className="text-gray-500 text-base mt-2">Back to start</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between w-full">
      <Text className="text-base text-gray-600">{label}</Text>
      <Text className="text-base font-semibold">{value}</Text>
    </View>
  );
}
