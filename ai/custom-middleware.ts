import { CoreMessage, Experimental_LanguageModelV1Middleware, Message } from "ai";

// Simple function to detect language
function detectLanguage(text: string): string {
  // Chinese character range detection
  const chinesePattern = /[\u4e00-\u9fa5]/;
  
  // If contains Chinese characters, consider it as Chinese
  if (chinesePattern.test(text)) {
    return 'chinese';
  }
  
  // Spanish specific character detection
  const spanishPattern = /[áéíóúüñ¿¡]/i;
  if (spanishPattern.test(text)) {
    return 'spanish';
  }
  
  // Additional detection logic for other languages can be added as needed
  
  // Default to English
  return 'english';
}

// Define empty middleware object, language detection is handled manually in API routes
export const customMiddleware: Experimental_LanguageModelV1Middleware = {};
