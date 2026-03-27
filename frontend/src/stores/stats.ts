import { GetMqttStats } from "bindings/backend/app/app";
import type { MqttStats as WailsMqttStats } from "bindings/backend/app/models";
import { get, writable } from "svelte/store";

export type MqttStats = Omit<WailsMqttStats, "createFrom">;

export enum StatsMode {
  ConnPerSec = "conn-per-sec",
  TotalPerSec = "total-per-sec",
}

let modes = [StatsMode.ConnPerSec, StatsMode.TotalPerSec];

interface StatsStore {
  mode: StatsMode;
  currentTotal: MqttStats;
  diffFrom1sAgo: MqttStats;
}

const { subscribe, set, update } = writable<StatsStore>(
  {
    mode: StatsMode.ConnPerSec,
    currentTotal: {
      totalBytesReceived: 0,
      totalBytesSent: 0,
      totalMessagesReceived: 0,
      totalMessagesSent: 0,
      statsByConnection: {},
    },
    diffFrom1sAgo: {
      totalBytesReceived: 0,
      totalBytesSent: 0,
      totalMessagesReceived: 0,
      totalMessagesSent: 0,
      statsByConnection: {},
    },
  },
  (set) => {
    getStats();
    setInterval(getStats, 1000);
  }
);

const toggleMode = () => {
  const currentState = get({ subscribe });
  const modeIndex = modes.indexOf(currentState.mode);
  const newModeIndex = (modeIndex + 1) % modes.length;
  set({
    mode: modes[newModeIndex],
    currentTotal: currentState.currentTotal,
    diffFrom1sAgo: currentState.diffFrom1sAgo,
  });
};

const getStats = async () => {
  try {
    const stats = await GetMqttStats();
    const currentState = get({ subscribe });
    const diffFromLast: MqttStats = {
      totalBytesReceived:
        stats.totalBytesReceived - currentState.currentTotal.totalBytesReceived,
      totalBytesSent:
        stats.totalBytesSent - currentState.currentTotal.totalBytesSent,
      totalMessagesReceived:
        stats.totalMessagesReceived -
        currentState.currentTotal.totalMessagesReceived,
      totalMessagesSent:
        stats.totalMessagesSent - currentState.currentTotal.totalMessagesSent,
      statsByConnection: {},
    };
    for (const [connectionId, statsByConnection] of Object.entries(
      stats.statsByConnection
    )) {
      const connId = Number(connectionId);
      if (!statsByConnection) continue;
      const prevStatsByConnection =
        currentState.currentTotal.statsByConnection[
          connectionId as `${number}`
        ];

      if (!prevStatsByConnection) {
        diffFromLast.statsByConnection[connectionId as `${number}`] = {
          bytesReceived: statsByConnection.bytesReceived,
          bytesSent: statsByConnection.bytesSent,
          messagesReceived: statsByConnection.messagesReceived,
          messagesSent: statsByConnection.messagesSent,
        };
        continue;
      }
      diffFromLast.statsByConnection[connectionId as `${number}`] = {
        bytesReceived:
          statsByConnection.bytesReceived - prevStatsByConnection.bytesReceived,
        bytesSent:
          statsByConnection.bytesSent - prevStatsByConnection.bytesSent,
        messagesReceived:
          statsByConnection.messagesReceived -
          prevStatsByConnection.messagesReceived,
        messagesSent:
          statsByConnection.messagesSent - prevStatsByConnection.messagesSent,
      };
    }

    set({
      mode: currentState.mode,
      currentTotal: stats,
      diffFrom1sAgo: diffFromLast,
    });
  } catch (e) {
    console.error(e);
  }
};

export default {
  subscribe,
  toggleMode,
};
