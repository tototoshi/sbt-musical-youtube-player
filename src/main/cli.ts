import path from "path";
import program from "commander";
import child_process from "child_process";
import fs from "fs";

interface PackageInfo {
  name: string;
  version: string;
}

const rootDir = path.join(__dirname, "..", "..");
const packageInfo: PackageInfo = require(path.resolve(
  rootDir,
  "package.json"
)) as PackageInfo;

interface VideoInfo {
  id: string;
  start: string;
}

function extractVideoInfoFromUrl(url: string): VideoInfo | null {
  let id: string | undefined = undefined;
  let start: string = "0s";

  const u = new URL(url);

  if (u.host === "www.youtube.com" && u.pathname === "/watch") {
    const searchParams = u.searchParams;
    const v = searchParams.get("v");
    const t = searchParams.get("t");
    if (v !== null) {
      id = v;
    }
    if (t !== null) {
      start = t;
    }
  }

  if (u.host === "youtu.be") {
    const searchParams = u.searchParams;
    const v = u.pathname.substring(1);
    const t = searchParams.get("t");
    if (v.length > 0) {
      id = v;
    }
    if (t !== null) {
      start = t;
    }
  }

  if (id === undefined) {
    return null;
  }

  return {
    id,
    start,
  };
}

function main() {
  program
    .name(packageInfo.name.replace("@tototoshi/", ""))
    .version(packageInfo.version)
    .arguments("<YouTube Video URL>")
    .parse(process.argv);

  if (program.args.length !== 1) {
    program.help();
  } else {
    const url = program.args[0];

    const videoInfo = extractVideoInfoFromUrl(url);

    if (videoInfo === null) {
      program.help();
    }

    const { id, start } = videoInfo;

    const embededUrl = `https://www.youtube.com/embed/${id}?autoplay=1&start=${start}`;

    const electronPath = path.join(
      // ${rootDir}/dist/main
      __dirname,
      // ${rootDir}/dist
      "..",
      // ${rootDir}
      "..",
      // ${rootDir}/node_modules
      "node_modules",
      // ${rootDir}/node_modules/electron
      "electron"
    );

    const electronPathTxt = path.join(electronPath, "path.txt");

    const electronExecutablePath = path.join(
      electronPath,
      "dist",
      fs.readFileSync(electronPathTxt, { encoding: "utf8" })
    );

    const child = child_process.spawn(
      electronExecutablePath,
      [rootDir, embededUrl],
      {
        stdio: "inherit",
        windowsHide: false,
      }
    );

    child.on("close", function (code) {
      if (code === null) {
        process.exit(1);
      }
      process.exit(code);
    });

    const handleTerminationSignal = function (signal: NodeJS.Signals) {
      process.on(signal, function signalHandler() {
        if (!child.killed) {
          child.kill(signal);
        }
      });
    };

    handleTerminationSignal("SIGINT");
    handleTerminationSignal("SIGTERM");
  }
}

main();
