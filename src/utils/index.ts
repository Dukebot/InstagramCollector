import dotenv from 'dotenv';
import fs from 'fs';

/** Loads environment variables from a `.env` file into `process.env`. */
function loadDotenv(): void {
  dotenv.config();
}

/** Writes arbitrary data as pretty-printed JSON to disk. */
function saveDataAsJson(filePath: string, data: unknown): void {
  let finalPath = filePath;
  if (!finalPath.endsWith('.json')) finalPath += '.json';
  fs.writeFileSync(finalPath, JSON.stringify(data, null, 2));
}

export { loadDotenv, saveDataAsJson };
