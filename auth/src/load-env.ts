import fs from "fs";
import path from "path";

// `npm start` outside compose/Kubernetes has no injected env. The repo .env is
// gitignored and is the same file docker-compose reads. Existing process env
// wins, so Kubernetes and compose values are left alone. A missing file is a no-op.
const envFile = path.resolve(__dirname, "../../.env");

if (fs.existsSync(envFile)) {
  for (const line of fs.readFileSync(envFile, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}
