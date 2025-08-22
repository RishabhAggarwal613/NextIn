import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";

import GradientBackground from "../../components/layouts/GradientBackground";
import FancyCard from "../../components/ui/FancyCard";

import * as QueueAPI from "../../api/queue.api";
import { useQueueStore } from "../../store/queue.store";
import useQueueSocket from "../../sockets/useQueueSocket";

export default function StatusScreen({ route }) {
  const { queueId, ticket } = route.params || {};

  const {
    position, ahead, total, eta,
    setFromStatus, setFromUpdate,
  } = useQueueStore();

  const [loading, setLoading] = useState(true);

  useQueueSocket(queueId, (payload) => setFromUpdate(payload));

  useEffect(() => {
    let timer;
    const refresh = async () => {
      try {
        const data = await QueueAPI.getStatus(queueId, ticket);
        setFromStatus(data);
      } finally {
        setLoading(false);
      }
    };
    refresh();
    timer = setInterval(refresh, 10_000);
    return () => clearInterval(timer);
  }, [queueId, ticket, setFromStatus]);

  return (
    <GradientBackground>
      <View className="flex-1 p-5 justify-center">
        <FancyCard title="Your Ticket">
          <Text className="text-text text-xl font-extrabold tracking-widest">{ticket}</Text>
        </FancyCard>

        <FancyCard title="Status" style={{ marginTop: 16 }}>
          <Text className="text-text">Position: {loading ? "-" : position}</Text>
          <Text className="text-text">Ahead: {loading ? "-" : ahead}</Text>
          <Text className="text-text">Waiting total: {loading ? "-" : total}</Text>
          <Text className="text-text mt-2">
            ETA: {eta ? `${eta.low}–${eta.high} min` : "-"}
          </Text>
          <Text className="text-text mt-1">
            Confidence: {eta?.confidence ?? "-"}
          </Text>
        </FancyCard>
      </View>
    </GradientBackground>
  );
}
