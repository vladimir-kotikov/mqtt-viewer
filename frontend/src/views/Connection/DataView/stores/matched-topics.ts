import { GetMatchingSubscriptionForTopic } from "bindings/backend/app/app";
import type { Subscription } from "bindings/backend/models/models";
import { get, writable } from "svelte/store";
type Topic = string;

interface MatchedTopicsStore {
  connectionId: number;
  topics: {
    [topic: Topic]: Subscription | null | undefined;
  };
}

export const createMatchedTopicsStore = (connId: number) => {
  const { subscribe, set, update } = writable<MatchedTopicsStore>({
    connectionId: connId,
    topics: {},
  });

  const getTopicMatch = async (topic: string) => {
    const { connectionId, topics } = get({ subscribe });
    const existing = topics[topic];
    if (existing !== undefined) {
      return existing;
    }
    const matchingTopic = await GetMatchingSubscriptionForTopic(
      connectionId,
      topic
    );
    let result: Subscription | null = null;
    if (matchingTopic !== null) result = matchingTopic;
    update((store) => {
      store.topics[topic] = result;
      return store;
    });
    return result;
  };

  const clearCache = () => {
    update((store) => {
      store.topics = {};
      return store;
    });
  };

  return {
    subscribe,
    clearCache,
    getTopicMatch,
  };
};
