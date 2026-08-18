import React from "react";
import { View, Text, Pressable, Switch } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import { useThemeStore } from "@/state/themeStore";

export default function Settings() {
  const router = useRouter();
  const setPreference = useThemeStore((s) => s.setPreference);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-black">
      <View className="flex-1 px-8 pt-4 gap-6">
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <Text className="text-gray-500 dark:text-gray-400 text-base">Back</Text>
        </Pressable>

        <Text className="text-3xl font-bold text-black dark:text-white">Settings</Text>

        <View className="flex-row justify-between items-center">
          <Text className="text-lg text-black dark:text-white">Dark mode</Text>
          <Switch
            value={isDark}
            onValueChange={(v) => setPreference(v ? "dark" : "light")}
            trackColor={{ false: "#d1d5db", true: "#4b5563" }}
            thumbColor="#ffffff"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
