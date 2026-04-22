import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getRepairAdvice(symptoms: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `بصفتك خبير صيانة سيارات محترف، قدم نصيحة تقنية بناءً على الأعراض التالية: "${symptoms}". 
      يرجى تقديم التشخيص المحتمل، الخطوات المقترحة للفحص، وقطع الغيار التي قد تكون مطلوبة. 
      اجعل الإجابة مختصرة ومهنية باللغة العربية.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "عذراً، تعذر الحصول على استشارة ذكاء اصطناعي في الوقت الحالي.";
  }
}

export async function suggestParts(vehicleInfo: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `قائمة بقطع الغيار الاستهلاكية الشائعة لسيارة: "${vehicleInfo}". 
      اذكر 5 قطع أساسية مع توضيح سبب أهميتها للصيانة الدورية. باللغة العربية.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "عذراً، تعذر الحصول على اقتراحات حالياً.";
  }
}

export async function predictMaintenance(history: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `بناءً على سجل الصيانة التالي للسيارة: "${history}"، توقع موعد الصيانة القادم وما هي الخدمات المطلوبة. 
      قدم نصيحة تسويقية يمكن إرسالها للعميل كرسالة تذكير دعائية جذابة تشجعه على الحجز. باللغة العربية.`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "لا توجد توقعات حالياً.";
  }
}

export async function askAssistant(prompt: string, context?: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `أنت مساعد ذكي متخصص في إدارة ورش السيارات. 
      السياق الحالي: ${context || "العمل العام في الورشة"}.
      السؤال: ${prompt}.
      أجب باللغة العربية بأسلوب مهني ومساعد.`,
    });
    return response.text;
  } catch (error) {
    console.error("Assistant Error:", error);
    return "عذراً، أواجه مشكلة في معالجة طلبك.";
  }
}
