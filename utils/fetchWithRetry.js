// frontend/utils/fetchWithRetry.js

/**
 * Fetch wrapper with retry logic.
 *
 * @param {string} url - The URL to fetch.
 * @param {object} options - Fetch options (method, headers, body, etc.).
 * @param {number} retries - Number of retry attempts.
 * @param {number} backoff - Initial backoff delay in milliseconds.
 * @returns {Promise<Response>} - The fetch response.
 */
export async function fetchWithRetry(url, options = {}, retries = 3, backoff = 300) {
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
          const delay = backoff * 2 ** attempt;
  
          console.warn(`Fetch attempt ${attempt + 1} failed. Retrying in ${delay}ms...`, error);
  
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          // After exhausting retries, throw the error
          console.error(`Fetch failed after ${retries + 1} attempts:`, error);
          throw error;
        }
      }
    }
  }
  