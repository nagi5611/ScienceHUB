// functions/api/lib/constants.ts
export const MULTIPART_THRESHOLD = 20 * 1024 * 1024;
export const PART_SIZE = 5 * 1024 * 1024;
export const MAX_FILE_SIZE = 200 * 1024 * 1024;
export const SLOT_CAPACITY = 1.0;
export const LEAD_TIME_DAYS = 2;
export const SESSION_COOKIE = 'session';
export const DEV_SESSION_COOKIE = 'dev_session';
export const USER_SESSION_COOKIE = 'user_session';
export const OAUTH_STATE_COOKIE = 'oauth_state';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
export const OAUTH_STATE_MAX_AGE = 60 * 10;

export const PRINT_SCALE_WEIGHT: Record<string, number> = {
  small: 0.5,
  medium: 1.0,
  large: 1.0,
};
