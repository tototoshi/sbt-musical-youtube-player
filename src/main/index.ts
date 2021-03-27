import path from "path";
import electron from "electron";
import program from "commander";

const createWindow = (url: string) => {
  const win = new electron.BrowserWindow({
    fullscreen: true,
    webPreferences: {
      preload: path.resolve(__dirname, "../preload/bundle.js"),
    },
  });

  win.webContents.on("new-window", (event, url) => {
    event.preventDefault();
    electron.shell.openExternal(url);
  });

  electron.ipcMain.handle("get-url", async () => {
    return url;
  });

  win.loadFile("index.html");
};

function main() {
  program.parse(process.argv);

  let url: string =
    "https://www.youtube.com/embed/b-Cr0EWwaTk?autoplay=1&start=15";
  if (program.args.length === 1) {
    url = program.args[0];
  }

  electron.app.on("ready", () => createWindow(url));
}

main();
