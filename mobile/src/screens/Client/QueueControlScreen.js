import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import GradientBackground from "../../components/layout/GradientBackground";
import FancyCard from "../../components/ui/FancyCard";
import BrandButton from "../../components/ui/BrandButton";
import { TextInput } from "react-native-paper";
import * as QueueAPI from "../../api/queue.api";
import { useQueueStore } from "../../store/queue.store";
import useQueueSocket from "../../sockets/useQueueSocket";

export default function QueueControlScreen() {
  const [qid, setQid] = useState("");
  const store = useQueueStore();
  useQueueSocket(qid, (p) => store.setFromUpdate(p));

  async function load() {
    if (!qid) return;
    const meta = await QueueAPI.getQueue(qid);
    store.setFromMeta(meta);
  }
  async function next() {
    if (!qid) return;
    await QueueAPI.serveNext(qid);
  }

  useEffect(() => { load(); }, [qid]);

  return (
    <GradientBackground>
      <View className="flex-1 p-4 justify-center">
        <FancyCard title="Queue Control">
          <TextInput mode="outlined" label="Queue ID" value={qid} onChangeText={setQid} style={{ marginBottom: 12 }} />
          <View className="flex-row justify-between mb-4">
            <Text className="text-text">Waiting: {store.total ?? "-"}</Text>
            <Text className="text-text">Next: {store.nextTicket ?? "-"}</Text>
            <Text className="text-text">Served: {store.servedTicket ?? "-"}</Text>
          </View>
          <BrandButton title="Next" icon="skip-next" onPress={next} />
        </FancyCard>
      </View>
    </GradientBackground>
  );
}
