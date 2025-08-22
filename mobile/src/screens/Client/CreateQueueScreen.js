import React, { useState } from "react";
import { View, Text } from "react-native";
import { TextInput } from "react-native-paper";
import * as Clipboard from "expo-clipboard";

import GradientBackground from "../../components/layouts/GradientBackground";
import FancyCard from "../../components/ui/FancyCard";
import BrandButton from "../../components/ui/BrandButton";

import * as QueueAPI from "../../api/queue.api";
import { useQueueStore } from "../../store/queue.store";

export default function CreateQueueScreen() {
  const [name, setName] = useState("My Queue");
  const [queueId, setQueueId] = useState(null);
  const [loading, setLoading] = useState(false);

  const setFromMeta = useQueueStore((s) => s.setFromMeta);

  const onCreate = async () => {
    try {
      setLoading(true);
      const { queueId } = await QueueAPI.createQueue({ name });
      const meta = await QueueAPI.getQueue(queueId);
      setFromMeta(meta);
      setQueueId(queueId);
    } finally {
      setLoading(false);
    }
  };

  const copyId = async () => {
    if (queueId) await Clipboard.setStringAsync(queueId);
  };

  return (
    <GradientBackground>
      <View className="flex-1 p-5 justify-center">
        <FancyCard title="Create a Queue" subtitle="Give your queue a short, friendly name.">
          <TextInput
            mode="outlined"
            label="Queue name"
            value={name}
            onChangeText={setName}
            style={{ marginBottom: 12 }}
          />
          <BrandButton title="Create Queue" icon="plus-circle" onPress={onCreate} loading={loading} />
        </FancyCard>

        {queueId ? (
          <FancyCard title="Queue ID" subtitle="Share this code with your customers." style={{ marginTop: 16 }}>
            <View className="flex-row items-center justify-between">
              <Text className="text-text text-2xl font-extrabold tracking-widest">{queueId}</Text>
              <BrandButton title="Copy" icon="content-copy" mode="outlined" onPress={copyId} />
            </View>
          </FancyCard>
        ) : null}
      </View>
    </GradientBackground>
  );
}
