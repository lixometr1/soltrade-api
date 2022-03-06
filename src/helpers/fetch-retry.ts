export const fetchRetry = async <T>(
  fn: (...args: any[]) => Promise<T>,
  maxTimes = 3,
) => {
  const retryier = async (times = 0): Promise<T> => {
    try {
      return await fn();
    } catch (err) {
      if (times > maxTimes) throw err;
      return retryier(times + 1);
    }
  };
  return retryier();
};
