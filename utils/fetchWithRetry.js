// frontend/utils/fetchWithRetry.js

/**
 * Fetch wrapper with retry logic and optional callbacks.
 *
 * @param {string} url - The URL to fetch.
 * @param {object} options - Fetch options (method, headers, body, etc.).
 * @param {number} retries - Number of retry attempts.
 * @param {number} backoff - Initial backoff delay in milliseconds.
 * @param {function} onRetry - Callback function invoked on each retry attempt.
 * @param {function} onFailure - Callback function invoked after all retries fail.
 * @returns {Promise<Response>} - The fetch response.
 */
export async function fetchWithRetry(
    url,
    options = {},
    retries = 3,
    backoff = 500,
    onRetry = () => {},
    onFailure = () => {}
  ) {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(url, options);
  
        // If the response is successful, return it
        if (response.ok) {
          return response;
        }
  
        // For specific status codes, you might want to retry (e.g., 429 Too Many Requests)
        if (response.status === 429 || (response.status >= 500 && response.status < 600)) {
          throw new Error(`Server Error: ${response.status}`);
        }
  
        // For other status codes, do not retry
        return response;
      } catch (error) {
        if (attempt < retries) {
          // Calculate delay with exponential backoff
          const delayTime = backoff * 2 ** attempt;
  
          console.warn(`Fetch attempt ${attempt + 1} failed. Retrying in ${delayTime}ms...`, error);
          onRetry(attempt + 1, delayTime, error);
  
          await new Promise((resolve) => setTimeout(resolve, delayTime));
        } else {
          // After exhausting retries, invoke failure callback and throw the error
          onFailure(error);
          console.error(`Fetch failed after ${retries + 1} attempts:`, error);
          throw error;
        }
      }
    }
  }
  