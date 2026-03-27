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
    const sysEnv = await System.Environment();
    const isFullscreen = await Window.IsFullscreen();
    const configuredEnv = await GetEnvInfo();
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
    });
  } catch (e) {
    console.error(e);
  }
};

export default {
  subscribe,
  init,
};
