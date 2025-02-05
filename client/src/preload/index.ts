import { contextBridge, ipcRenderer } from "electron";

// Custom APIs for renderer
const api = {
  fileExists: async (file: string): Promise<boolean> => {
    return await ipcRenderer.invoke("file:exists", file);
  },
  fileRead: async (file: string): Promise<Uint8Array|null> => {
    return await ipcRenderer.invoke("file:read", file);
  },
  fileWrite: async (file: string, data: string | Uint8Array): Promise<void> => {
    return await ipcRenderer.invoke("file:write", file, data);
  },
  fileOpen: async (extensions: string[]): Promise<string> => {
    return await ipcRenderer.invoke("file:open", extensions);
  },
  urlPreview: async (url: string) => {
    return await ipcRenderer.invoke("url:preview", url);
  },
  homedir: async () => {
    return await ipcRenderer.invoke("os:homedir");
  }
};

export type API = typeof api;

contextBridge.exposeInMainWorld("api", api);
