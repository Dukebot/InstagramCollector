import Location, { type LocationInput } from './location';

export interface PostUserRef {
  id?: string | number | null;
  username?: string | null;
}

export interface MediaItem {
  url: string;
  caption?: string | null;
}

export interface PostInput {
  pk?: string | number | null;
  id?: string | number | null;
  fbId?: string | number | null;
  mediaId?: string | number | null;
  code?: string | null;
  user?: PostUserRef | null;
  title?: string | null;
  text?: string | null;
  externalUrl?: string | null;
  takenAt?: number | null;
  date?: string | null;
  time?: string | null;
  location?: LocationInput | null;
  likeCount?: number | null;
  commentCount?: number | null;
  images?: MediaItem[];
  videos?: MediaItem[];
}

export default class Post {
  pk: string | number | null;
  id: string | number | null;
  fbId: string | number | null;
  mediaId: string | number | null;
  code: string | null;
  user: { id: string | number | null; username: string | null } | null;
  title: string | null;
  text: string | null;
  externalUrl: string | null;
  takenAt: number | null;
  date: string | null;
  time: string | null;
  location: Location | null;
  likeCount: number | null;
  commentCount: number | null;
  images: MediaItem[];
  videos: MediaItem[];

  constructor(data: PostInput = {}) {
    this.pk = data.pk ?? null;
    this.id = data.id ?? null;
    this.fbId = data.fbId ?? null;
    this.mediaId = data.mediaId ?? null;
    this.code = data.code ?? null;

    const user = data.user ?? null;
    this.user = user && user.id ? { id: user.id, username: user.username ?? null } : null;

    this.title = data.title ?? null;
    this.text = data.text ?? null;
    this.externalUrl = data.externalUrl ?? null;
    this.takenAt = data.takenAt ?? null;
    this.date = data.date ?? null;
    this.time = data.time ?? null;

    this.location = data.location ? new Location(data.location) : null;

    this.likeCount = data.likeCount ?? null;
    this.commentCount = data.commentCount ?? null;
    this.images = data.images ?? [];
    this.videos = data.videos ?? [];
  }
}
