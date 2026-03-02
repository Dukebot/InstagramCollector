import dotenv from 'dotenv';
import fs from 'fs';

function loadDotenv(): void {
  dotenv.config();
}

function saveDataAsJson(filePath: string, data: unknown): void {
  let finalPath = filePath;
  if (!finalPath.endsWith('.json')) finalPath += '.json';
  fs.writeFileSync(finalPath, JSON.stringify(data, null, 2));
}

export { loadDotenv, saveDataAsJson };
