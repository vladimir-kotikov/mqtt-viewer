import { System, Window } from "@wailsio/runtime";
import { GetEnvInfo } from "bindings/backend/app/app";
import _ from "lodash";
import { writable } from "svelte/store";

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
  isServer: boolean;
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
  isServer: false,
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
    const configuredEnv = await GetEnvInfo();
    const isServer = configuredEnv.isServer;
    // Window.* API requires a native WebviewWindow — not available in server mode.
    const isFullscreen = isServer ? false : await Window.IsFullscreen();
    const sysEnv = await System.Environment();
    if (!isServer) {
      window.addEventListener("resize", debouncedCheckFullscreen, true);
    }
    set({
      env: {
        buildType: sysEnv.Debug ? "debug" : "production",
        platform: sysEnv.OS,
        arch: sysEnv.Arch,
      },
      isFullscreen,
      version: configuredEnv.version,
      isMac: System.IsMac(),
      isWindows: System.IsWindows(),
      isLinux: System.IsLinux(),
      isBeta: IS_BETA,
      isServer,
    });
  } catch (e) {
    console.error(e);
  }
};

export default {
  subscribe,
  init,
};
