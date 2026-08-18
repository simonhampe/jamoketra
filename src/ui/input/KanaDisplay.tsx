import React from "react";
import { View, Text } from "react-native";
import { ComparisonResult, MoraStatus } from "@/domain/comparator";

const STATUS_CLASSES: Record<MoraStatus, string> = {
  correct: "text-green-600 dark:text-green-400",
  incorrect: "text-red-600 dark:text-red-400 underline",
  extra: "text-red-400 dark:text-red-300 line-through",
  pending: "text-gray-400 dark:text-gray-500",
};

interface Props {
  comparison: ComparisonResult;
}

export function KanaDisplay({ comparison }: Props) {
  return (
    <View className="flex-row flex-wrap justify-center">
      {comparison.moraeComparison.map((m, i) => (
        <Text key={i} className={`text-5xl font-bold ${STATUS_CLASSES[m.status]}`}>
          {m.mora}
        </Text>
      ))}
    </View>
  );
}
