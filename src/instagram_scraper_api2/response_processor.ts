import moment from 'moment';
import { User, Post } from '../entities';

/**
 * Transforms raw scraper responses into normalized domain entities.
 */
class InstagramScraperAPI2ResponseProcessor {
  /**
   * Converts a raw profile response into a `User` entity.
   */
  static processUserInfoResponse(response: any): User {
    return transformUser(response.data);
  }

  /**
   * Converts a raw posts response into a list of `Post` entities.
   */
  static processUserPostsResponse(response: any): Post[] {
    return response.data.items.map(transformPost);
  }
}

/** Maps raw user payload to a normalized `User` entity. */
function transformUser(user: any): User {
  return new User({
    id: user.id,
    fullName: user.full_name,
    username: user.username,
    biography: user.biography,
    externalUrl: user.external_url,
  });
}

/** Maps raw post payload to a normalized `Post` entity. */
function transformPost(post: any): Post {
  const getImageUrlFromImageVersions = () => post.image_versions?.items?.[0]?.url ?? null;
  const getVideoUrlFromVideoVersions = () => (post.video_versions ? post.video_versions[0]?.url : null);
  const urlToMediaObject = (url: string) => ({ url, caption: null });

  function transformLocation() {
    const location = post.location;
    if (!location) {
      return null;
    }
    return {
      pk: location.id,
      name: location.name,
      lat: location.lat,
      lng: location.lng,
    };
  }

  function getDate() {
    if (!post.taken_at) return null;
    const dateTime = timestampToDateString(post.taken_at);
    return dateTime.split(' ')[0] ?? null;
  }

  function getTime() {
    if (!post.taken_at) return null;
    const dateTime = timestampToDateString(post.taken_at);
    return dateTime.split(' ')[1] ?? null;
  }

  return new Post({
    pk: post.id,
    id: post.id,
    fbId: post.fbid,
    code: post.code,
    user: {
      id: post.user?.id,
      username: post.user?.username,
    },
    text: post.caption ? post.caption.text : null,
    takenAt: post.taken_at ? Number(post.taken_at) : null,
    date: getDate(),
    time: getTime(),
    location: transformLocation(),
    likeCount: post.like_count,
    commentCount: post.comment_count,
    images: [getImageUrlFromImageVersions()].filter(Boolean).map((u) => urlToMediaObject(u as string)),
    videos: [getVideoUrlFromVideoVersions()].filter(Boolean).map((u) => urlToMediaObject(u as string)),
  });
}

/** Converts a unix timestamp to a formatted date string. */
function timestampToDateString(timestamp: number, format = 'YYYY-MM-DD HH:mm:ss'): string {
  return moment.unix(timestamp).format(format);
}

export default InstagramScraperAPI2ResponseProcessor;
