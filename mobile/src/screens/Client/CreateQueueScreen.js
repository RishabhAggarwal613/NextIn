import React, { useState } from "react";
import { View } from "react-native";
import GradientBackground from "../../components/layout/GradientBackground";
import FancyCard from "../../components/ui/FancyCard";
import BrandButton from "../../components/ui/BrandButton";
import { TextInput } from "react-native-paper";
import * as QueueAPI from "../../api/queue.api";
import { useQueueStore } from "../../store/queue.store";

export default function CreateQueueScreen() {
  const [name, setName] = useState("My Queue");
  const [queueId, setQueueId] = useState(null);
  const setFromMeta = useQueueStore((s) => s.setFromMeta);

  async function create() {
    const { queueId } = await QueueAPI.createQueue({ name });
    const meta = await QueueAPI.getQueue(queueId);
    setFromMeta(meta);
    setQueueId(queueId);
  }

  return (
    <GradientBackground>
      <View className="flex-1 p-4 justify-center">
        <FancyCard title="Create a Queue">
          <TextInput mode="outlined" label="Queue name" value={name} onChangeText={setName} style={{ marginBottom: 12 }} />
          <BrandButton title="Create Queue" icon="plus-circle" onPress={create} />
        </FancyCard>
        {queueId ? (
          <FancyCard title="Queue ID" subtitle="Share this with customers" style={{ marginTop: 16 }}>
            <View className="flex-row items-center justify-between">
              <TextInput mode="outlined" value={queueId} editable={false} style={{ flex: 1 }} />
            </View>
          </FancyCard>
        ) : null}
      </View>
    </GradientBackground>
  );
}
