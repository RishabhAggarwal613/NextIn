import React, { useState } from "react";
import { View } from "react-native";
import GradientBackground from "../../components/layout/GradientBackground";
import FancyCard from "../../components/ui/FancyCard";
import BrandButton from "../../components/ui/BrandButton";
import { TextInput } from "react-native-paper";
import * as QueueAPI from "../../api/queue.api";
import { useQueueStore } from "../../store/queue.store";
import { SCREENS } from "../../navigation/types";

const ID_RE = /^[A-Z2-9]{6}$/i;

export default function JoinQueueScreen({ navigation }) {
  const [queueId, setQueueId] = useState("");
  const [name, setName] = useState("");
  const setTicket = useQueueStore((s) => s.setTicket);

  async function join() {
    if (!ID_RE.test(queueId)) return;
    const id = queueId.toUpperCase();
    const out = await QueueAPI.joinQueue(id, { name });
    setTicket(id, out.ticket);
    navigation.navigate(SCREENS.Status, { queueId: id, ticket: out.ticket });
  }

  return (
    <GradientBackground>
      <View className="flex-1 p-4 justify-center">
        <FancyCard title="Join a Queue">
          <TextInput mode="outlined" label="Queue ID" value={queueId} onChangeText={setQueueId} style={{ marginBottom: 12 }} />
          <TextInput mode="outlined" label="Your Name" value={name} onChangeText={setName} style={{ marginBottom: 12 }} />
          <BrandButton title="Join Queue" icon="login" onPress={join} />
        </FancyCard>
      </View>
    </GradientBackground>
  );
}
