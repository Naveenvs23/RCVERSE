import { spawn } from "node:child_process";
import process from "node:process";

// npm.cmd and a shell are needed on windows. on unix-like systems npm is spawned directly.
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
const npmOptions = { stdio: "inherit", shell: process.platform === "win32" };
const processes = [
  spawn(npmCommand, ["run", "server"], npmOptions),
  spawn(npmCommand, ["run", "dev"], npmOptions),
];

let stopping = false;

// stop both child services together so one does not remain running after exit.
function stopAll(signal = "SIGTERM") {
  if (stopping) return;
  stopping = true;
  for (const child of processes) {
    if (!child.killed) child.kill(signal);
  }
}

for (const child of processes) {
  // a child error or unexpected exit shuts down its partner and reports failure.
  child.on("error", (error) => {
    console.error("Could not start a development service:", error.message);
    stopAll();
    process.exitCode = 1;
  });
  child.on("exit", (code) => {
    if (!stopping) {
      console.error(`A development service stopped (${code ?? "unknown exit"}). Stopping the other service too.`);
      stopAll();
      process.exitCode = code || 1;
    }
  });
}

process.on("SIGINT", () => stopAll("SIGINT"));
process.on("SIGTERM", () => stopAll("SIGTERM"));
