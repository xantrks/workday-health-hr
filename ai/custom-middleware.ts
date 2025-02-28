import { CoreMessage, Experimental_LanguageModelV1Middleware, Message } from "ai";

// 用于检测语言的简单函数
function detectLanguage(text: string): string {
  // 中文字符范围检测
  const chinesePattern = /[\u4e00-\u9fa5]/;
  
  // 如果包含中文字符，认为是中文
  if (chinesePattern.test(text)) {
    return 'chinese';
  }
  
  // 西班牙语特有字符检测
  const spanishPattern = /[áéíóúüñ¿¡]/i;
  if (spanishPattern.test(text)) {
    return 'spanish';
  }
  
  // 其他语言可以根据需要添加更多检测逻辑
  
  // 默认返回英语
  return 'english';
}

// 定义空的中间件对象，在API路由中手动处理语言检测
export const customMiddleware: Experimental_LanguageModelV1Middleware = {};
