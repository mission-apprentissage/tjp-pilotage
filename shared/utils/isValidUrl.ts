export const isValidUrl = (url: string) => {
  try {
    const urlRegex =
      /^(https?:\/\/|ftp:\/\/)(?:localhost|[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,})(?::\d{1,5})?(?:\/[^\s]*)?$/;
    if (!urlRegex.test(url)) {
      return false;
    }
    return Boolean(new URL(url));
  } catch {
    return false;
  }
};
