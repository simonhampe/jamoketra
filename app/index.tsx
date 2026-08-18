import React from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Onboarding() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <Pressable
        className="absolute top-8 left-4 p-2 z-10"
        onPress={() => router.push("/settings")}
        hitSlop={12}
      >
        <Text className="text-2xl text-black dark:text-white">⚙</Text>
      </Pressable>
      <View className="flex-1 justify-center items-center px-8 gap-6">
        <Text className="text-4xl font-bold text-black dark:text-white">Jamoketra</Text>
        <Text className="text-base text-gray-600 dark:text-gray-300 text-center">
          Practice typing hiragana &amp; katakana. Random pseudo-words, 60 second rounds.
        </Text>
        <View className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-300 dark:border-yellow-700 rounded-xl p-4">
          <Text className="text-sm text-yellow-900 dark:text-yellow-200 font-semibold mb-1">Before you start</Text>
          <Text className="text-sm text-yellow-900 dark:text-yellow-200">
            Switch your keyboard to a Japanese kana/flick input mode (not romaji). This app reads
            what your IME composes directly -- romaji-to-kana conversion isn&apos;t supported yet.
          </Text>
        </View>
        <Pressable
          className="bg-black dark:bg-white rounded-full px-8 py-4"
          onPress={() => router.push("/play")}
        >
          <Text className="text-white dark:text-black text-lg font-semibold">Start 60s round</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
