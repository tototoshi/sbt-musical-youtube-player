import electron from "electron";

declare global {
  const electron: electron;
}

interface electron {
  getUrl: () => Promise<string>;
}
