import React, { useState } from "react";
import { View } from "react-native";
import { TextInput } from "react-native-paper";

import GradientBackground from "../../components/layouts/GradientBackground";
import FancyCard from "../../components/ui/FancyCard";
import BrandButton from "../../components/ui/BrandButton";

import * as QueueAPI from "../../api/queue.api";
import { useQueueStore } from "../../store/queue.store";
import { SCREENS } from "../../navigation/types";

const ID_RE = /^[A-Z2-9]{6}$/i;

export default function JoinQueueScreen({ navigation }) {
  const [queueId, setQueueId] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const setTicket = useQueueStore((s) => s.setTicket);

  const onJoin = async () => {
    if (!ID_RE.test(queueId)) return;
    try {
      setLoading(true);
      const id = queueId.toUpperCase();
      const out = await QueueAPI.joinQueue(id, { name });
      setTicket(id, out.ticket);
      navigation.navigate(SCREENS.Status, { queueId: id, ticket: out.ticket });
    } finally {
      setLoading(false);
    }
  };

  return (
    <GradientBackground>
      <View className="flex-1 p-5 justify-center">
        <FancyCard title="Join a Queue" subtitle="Enter the 6-character code from the display.">
          <TextInput
            mode="outlined"
            label="Queue ID"
            value={queueId}
            onChangeText={setQueueId}
            style={{ marginBottom: 12 }}
            placeholder="ABC123"
            autoCapitalize="characters"
          />
          <TextInput
            mode="outlined"
            label="Your Name"
            value={name}
            onChangeText={setName}
            style={{ marginBottom: 12 }}
            placeholder="e.g., Rishabh"
          />
          <BrandButton title="Join Queue" icon="login" onPress={onJoin} loading={loading} />
        </FancyCard>
      </View>
    </GradientBackground>
  );
}
