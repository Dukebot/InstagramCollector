/** Input shape used to build an `InstagramUser` entity. */
export interface InstagramUserInput {
  id?: string | number | null;
  fullName?: string | null;
  username?: string | null;
  biography?: string | null;
  externalUrl?: string | null;
}

/** Normalized Instagram user entity. */
export default class InstagramUser {
  id: string | number | null;
  fullName: string | null;
  username: string | null;
  biography: string | null;
  externalUrl: string | null;

  /** Creates a normalized `InstagramUser` instance. */
  constructor(data: InstagramUserInput = {}) {
    this.id = data.id ?? null;
    this.fullName = data.fullName ?? null;
    this.username = data.username ?? null;
    this.biography = data.biography ?? null;
    this.externalUrl = data.externalUrl ?? null;
  }
}
