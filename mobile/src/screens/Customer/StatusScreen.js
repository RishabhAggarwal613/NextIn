import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import GradientBackground from "../../components/layout/GradientBackground";
import FancyCard from "../../components/ui/FancyCard";
import * as QueueAPI from "../../api/queue.api";
import { useQueueStore } from "../../store/queue.store";
import useQueueSocket from "../../sockets/useQueueSocket";

export default function StatusScreen({ route }) {
  const { queueId, ticket } = route.params || {};
  const store = useQueueStore();
  const [loading, setLoading] = useState(true);

  useQueueSocket(queueId, (p) => store.setFromUpdate(p));

  async function refresh() {
    const data = await QueueAPI.getStatus(queueId, ticket);
    store.setFromStatus(data);
    setLoading(false);
  }

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 10000);
    return () => clearInterval(id);
  }, [queueId, ticket]);

  return (
    <GradientBackground>
      <View className="flex-1 p-4 justify-center">
        <FancyCard title="Your Ticket">
          <Text className="text-text text-xl font-extrabold">{ticket}</Text>
        </FancyCard>
        <FancyCard title="Status" style={{ marginTop: 16 }}>
          <Text className="text-text">Position: {loading ? "-" : store.position}</Text>
          <Text className="text-text">Ahead: {loading ? "-" : store.ahead}</Text>
          <Text className="text-text">Waiting total: {loading ? "-" : store.total}</Text>
          <Text className="text-text mt-2">ETA: {store.eta ? `${store.eta.low}–${store.eta.high} min` : "-"}</Text>
          <Text className="text-text mt-1">Confidence: {store.eta?.confidence ?? "-"}</Text>
        </FancyCard>
      </View>
    </GradientBackground>
  );
}
