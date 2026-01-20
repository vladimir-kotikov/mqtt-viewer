import { get, writable } from "svelte/store";
import { System, Window } from "@wailsio/runtime";
import _ from "lodash";
import { GetEnvInfo } from "wailsjs/go/app/App";

const IS_BETA = true;

interface EnvStore {
  env: {
    buildType: string;
    platform: string;
    arch: string;
  };
  version: string;
  isMac: boolean;
  isWindows: boolean;
  isLinux: boolean;
  isFullscreen: boolean;
  isBeta: boolean;
}

const { subscribe, set, update } = writable<EnvStore>({
  env: {
    buildType: "",
    platform: "",
    arch: "",
  },
  version: "",
  isMac: false,
  isWindows: false,
  isLinux: false,
  isFullscreen: false,
  isBeta: IS_BETA,
});

const debouncedCheckFullscreen = _.debounce(async () => {
  const isFullscreen = await Window.IsFullscreen();
  update((store) => {
    return {
      ...store,
      isFullscreen,
    };
  });
}, 100);

const init = async () => {
  try {
    window.addEventListener("resize", debouncedCheckFullscreen, true);
    const env = System.Environment();
    const isFullscreen = await Window.IsFullscreen();
    const configuredEnv = await GetEnvInfo();
    set({
      env: {
        buildType: env.Debug ? "dev" : "production",
        platform: env.OS,
        arch: env.Arch,
      },
      isFullscreen,
      version: configuredEnv.version,
      isMac: env.OS === "darwin",
      isWindows: env.OS === "windows",
      isLinux: env.OS === "linux",
      isBeta: IS_BETA,
    });
  } catch (e) {
    console.error(e);
  }
};

export default {
  subscribe,
  init,
};
