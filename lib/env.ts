// This file handles environment variables, ensuring they exist with default values

// IBM watsonx AI configuration
export const WATSONX_CONFIG = {
  API_KEY: process.env.WATSONX_API_KEY || '',
  DEPLOYMENT_ID: process.env.WATSONX_DEPLOYMENT_ID || '',
  API_URL: process.env.NEXT_PUBLIC_WATSONX_API_URL || '',
  TOKEN_URL: process.env.WATSONX_TOKEN_URL || '',
  VERSION: process.env.WATSONX_VERSION || '',
  SYSTEM_MESSAGE: process.env.WATSONX_SYSTEM_MESSAGE || ''
}; 