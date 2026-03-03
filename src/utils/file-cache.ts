import fsp from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

/** Constructor options for `FileCache`. */
interface FileCacheOptions {
  dir: string;
  defaultTtlMs?: number;
  maxKeyLength?: number;
}

/** Optional controls for `wrap()`. */
interface WrapOptions {
  ttlMs?: number;
  force?: boolean;
}

/** Optional controls for `set()`. */
interface SetOptions {
  ttlMs?: number;
}

type CacheMemEntry = { value: unknown; expiresAt: number | null };

/**
 * Minimal file-based cache with TTL and in-flight deduplication.
 */
export default class FileCache {
  private dir: string;
  private defaultTtlMs: number;
  private maxKeyLength: number;
  private _mem: Map<string, CacheMemEntry>;
  private _inflight: Map<string, Promise<unknown>>;

  /**
   * Creates a cache instance bound to a directory on disk.
   */
  constructor({ dir, defaultTtlMs = 60_000, maxKeyLength = 200 }: FileCacheOptions) {
    if (!dir) throw new Error("FileCache: 'dir' es obligatorio");
    this.dir = dir;
    this.defaultTtlMs = defaultTtlMs;
    this.maxKeyLength = maxKeyLength;
    this._mem = new Map();
    this._inflight = new Map();
  }

  /** Ensures the cache directory exists. */
  async init(): Promise<void> {
    await fsp.mkdir(this.dir, { recursive: true });
  }

  /** Builds a safe file path for a cache key. */
  private _filePath(key: string): string {
    if (typeof key !== 'string' || !key) {
      throw new Error('FileCache: key inválida');
    }

    const prefix = key.slice(0, this.maxKeyLength).replace(/[^a-zA-Z0-9._-]/g, '_');
    const hash = crypto.createHash('sha1').update(key).digest('hex');
    return path.join(this.dir, `${prefix}.${hash}.json`);
  }

  /** Reads a value from memory/disk cache if present and valid. */
  async get(key: string): Promise<unknown | null> {
    const memEntry = this._mem.get(key);
    if (memEntry) {
      if (!memEntry.expiresAt || memEntry.expiresAt > Date.now()) {
        return memEntry.value;
      }
      this._mem.delete(key);
    }

    const file = this._filePath(key);
    let raw: string;

    try {
      raw = await fsp.readFile(file, 'utf8');
    } catch (err: any) {
      if (err.code === 'ENOENT') return null;
      throw err;
    }

    let parsed: { value?: unknown; expiresAt?: number | null };
    try {
      parsed = JSON.parse(raw);
    } catch {
      await this._safeUnlink(file);
      return null;
    }

    const { value, expiresAt } = parsed || {};
    if (expiresAt && expiresAt <= Date.now()) {
      await this._safeUnlink(file);
      return null;
    }

    this._mem.set(key, { value: value ?? null, expiresAt: expiresAt ?? null });
    return value ?? null;
  }

  /** Writes a value to cache with optional TTL override. */
  async set(key: string, value: unknown, { ttlMs }: SetOptions = {}): Promise<boolean> {
    const expiresAt =
      ttlMs === 0 ? null : Date.now() + (typeof ttlMs === 'number' ? ttlMs : this.defaultTtlMs);

    const file = this._filePath(key);
    const payload = JSON.stringify({ value, expiresAt }, null, 0);

    await fsp.mkdir(this.dir, { recursive: true });
    const tmp = `${file}.tmp.${process.pid}.${Date.now()}`;

    await fsp.writeFile(tmp, payload, 'utf8');
    await fsp.rename(tmp, file);

    this._mem.set(key, { value, expiresAt });
    return true;
  }

  /** Deletes a cache entry from memory and disk. */
  async del(key: string): Promise<boolean> {
    this._mem.delete(key);
    const file = this._filePath(key);
    await this._safeUnlink(file);
    return true;
  }

  /** Deletes a file and ignores ENOENT. */
  private async _safeUnlink(file: string): Promise<void> {
    try {
      await fsp.unlink(file);
    } catch (err: any) {
      if (err.code !== 'ENOENT') throw err;
    }
  }

  /**
   * Returns cached value if available; otherwise resolves, stores and returns a fresh value.
   */
  async wrap(key: string, fn: () => Promise<unknown>, { ttlMs, force = false }: WrapOptions = {}): Promise<unknown> {
    if (!force) {
      const cached = await this.get(key);
      if (cached !== null) return cached;
    }

    if (this._inflight.has(key)) {
      return this._inflight.get(key)!;
    }

    const p = (async () => {
      try {
        const fresh = await fn();
        await this.set(key, fresh, { ttlMs });
        return fresh;
      } finally {
        this._inflight.delete(key);
      }
    })();

    this._inflight.set(key, p);
    return p;
  }

  /** Removes expired/corrupt cache files and returns cleanup stats. */
  async cleanupExpired(): Promise<{ scanned: number; removed: number }> {
    await this.init();
    const files = await fsp.readdir(this.dir);

    let scanned = 0;
    let removed = 0;

    for (const name of files) {
      if (!name.endsWith('.json')) continue;
      const file = path.join(this.dir, name);
      scanned++;

      let raw: string;
      try {
        raw = await fsp.readFile(file, 'utf8');
      } catch {
        continue;
      }

      try {
        const parsed = JSON.parse(raw);
        const expiresAt = parsed?.expiresAt ?? null;
        if (expiresAt && expiresAt <= Date.now()) {
          await this._safeUnlink(file);
          removed++;
        }
      } catch {
        await this._safeUnlink(file);
        removed++;
      }
    }

    return { scanned, removed };
  }
}
