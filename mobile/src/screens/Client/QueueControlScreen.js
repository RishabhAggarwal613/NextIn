import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { TextInput } from "react-native-paper";

import GradientBackground from "../../components/layouts/GradientBackground";
import FancyCard from "../../components/ui/FancyCard";
import BrandButton from "../../components/ui/BrandButton";

import * as QueueAPI from "../../api/queue.api";
import { useQueueStore } from "../../store/queue.store";
import useQueueSocket from "../../sockets/useQueueSocket";

export default function QueueControlScreen() {
  const [qid, setQid] = useState("");
  const { total, nextTicket, servedTicket, setFromMeta, setFromUpdate } = useQueueStore();

  useQueueSocket(qid, (payload) => setFromUpdate(payload));

  useEffect(() => {
    const load = async () => {
      if (!qid) return;
      try {
        const meta = await QueueAPI.getQueue(qid);
        setFromMeta(meta);
      } catch {}
    };
    load();
  }, [qid, setFromMeta]);

  const onNext = async () => {
    if (!qid) return;
    try {
      await QueueAPI.serveNext(qid);
    } catch {}
  };

  return (
    <GradientBackground>
      <View className="flex-1 p-5 justify-center">
        <FancyCard title="Queue Control" subtitle="Monitor and advance the queue.">
          <TextInput
            mode="outlined"
            label="Queue ID"
            value={qid}
            onChangeText={setQid}
            style={{ marginBottom: 12 }}
            autoCapitalize="characters"
          />

          <View className="flex-row justify-between mb-4">
            <Text className="text-text">Waiting: {total ?? "-"}</Text>
            <Text className="text-text">Next: {nextTicket ?? "-"}</Text>
            <Text className="text-text">Served: {servedTicket ?? "-"}</Text>
          </View>

          <BrandButton title="Next" icon="skip-next" onPress={onNext} />
        </FancyCard>
      </View>
    </GradientBackground>
  );
}
