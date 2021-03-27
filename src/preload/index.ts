import { contextBridge, ipcRenderer } from "electron";

function getUrl(): Promise<string> {
  return ipcRenderer.invoke("get-url");
}

contextBridge.exposeInMainWorld("electron", {
  getUrl,
});
