import { Window } from "@wailsio/runtime";
import {
  GetEnvInfo,
  GetPanelSizes,
  UpdatePanelSize,
} from "bindings/backend/app/app";
import { writable } from "svelte/store";

type SizePx = number;

interface PanelSizes {
  rootWindowWidth: SizePx;
  rootWindowHeight: SizePx;
  resizablePanelSizes: {
    [panelId: string]: {
      size: SizePx;
      isOpen: boolean;
    };
  };
}

const { subscribe, set, update } = writable<PanelSizes>({
  rootWindowHeight: 0,
  rootWindowWidth: 0,
  resizablePanelSizes: {},
});

const init = async () => {
  try {
    const { isServer } = await GetEnvInfo();
    const panelSizes = await GetPanelSizes();
    const resizablePanelSizes: {
      [id: string]: {
        size: SizePx;
        isOpen: boolean;
      };
    } = {};
    for (const panelSize of panelSizes) {
      resizablePanelSizes[panelSize.id] = {
        size: panelSize.size,
        isOpen: panelSize.isOpen,
      };
    }
    if (isServer) {
      // In server mode Window.Size() is unavailable. Only update resizablePanelSizes;
      // rootWindowWidth/Height are kept as set by App.svelte's bind:clientWidth so
      // ResizableContainer maxSize stays correct.
      update((store) => ({ ...store, resizablePanelSizes }));
    } else {
      const windowSize = await Window.Size();
      set({
        rootWindowHeight: windowSize.height,
        rootWindowWidth: windowSize.width,
        resizablePanelSizes,
      });
    }
  } catch (e) {
    console.error(e);
  }
};

const updatePanelSize = (panelId: string, size: SizePx, isOpen: boolean) => {
  try {
    UpdatePanelSize(panelId, Math.round(size), isOpen);
    update((store) => {
      store.resizablePanelSizes[panelId] = {
        size: Math.round(size),
        isOpen,
      };
      return store;
    });
  } catch (e) {
    console.error(e);
  }
};

const updateAppWidth = (width: SizePx) => {
  update((store) => {
    store.rootWindowWidth = width;
    return store;
  });
};

export default {
  subscribe,
  init,
  updatePanelSize,
  updateAppWidth,
};
