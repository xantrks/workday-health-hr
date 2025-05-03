// This file handles environment variables, ensuring they exist with default values

// IBM watsonx AI configuration
export const WATSONX_CONFIG = {
  API_KEY: process.env.WATSONX_API_KEY || '',
  DEPLOYMENT_ID: process.env.WATSONX_DEPLOYMENT_ID || '',
  API_URL: process.env.NEXT_PUBLIC_WATSONX_API_URL || 'https://us-south.ml.cloud.ibm.com/ml/v4/deployments',
  TOKEN_URL: process.env.WATSONX_TOKEN_URL || 'https://iam.cloud.ibm.com/identity/token',
  VERSION: process.env.WATSONX_VERSION || '2021-05-01'
};

// Add debugging info that will be visible in browser console
if (typeof window !== 'undefined') {
  console.log('[DEBUG] WATSONX_CONFIG loaded:', {
    API_URL: WATSONX_CONFIG.API_URL,
    TOKEN_URL: WATSONX_CONFIG.TOKEN_URL,
    VERSION: WATSONX_CONFIG.VERSION,
    HAS_API_KEY: Boolean(WATSONX_CONFIG.API_KEY),
    HAS_DEPLOYMENT_ID: Boolean(WATSONX_CONFIG.DEPLOYMENT_ID),
    // Safe redacted version for debugging
    API_KEY_PREFIX: WATSONX_CONFIG.API_KEY ? WATSONX_CONFIG.API_KEY.substring(0, 4) + '...' : 'not set',
    DEPLOYMENT_ID_PREFIX: WATSONX_CONFIG.DEPLOYMENT_ID ? WATSONX_CONFIG.DEPLOYMENT_ID.substring(0, 4) + '...' : 'not set',
  });
} 