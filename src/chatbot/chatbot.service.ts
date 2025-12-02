import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
}

@Injectable()
export class ChatbotService {
  private readonly GENERATE_URL =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  constructor(private readonly http: HttpService) {}

  async askAI(message: string): Promise<string> {
    try {
      const payload = {
        contents: [
          {
            parts: [{ text: message }],
          },
        ],
        // có thể thêm các param: temperature, safetySettings...
      };

      const resp = await firstValueFrom(
        this.http.post<GeminiResponse>(
          `${this.GENERATE_URL}?key=${process.env.GEMINI_API_KEY}`,
          payload,
          { headers: { 'Content-Type': 'application/json' } },
        ),
      );

      // Ép kiểu any để tránh lỗi TS, lấy text
      const aiText =
        (resp.data as any)?.candidates?.[0]?.content?.parts?.[0]?.text || '';

      return aiText.trim();
    } catch (err) {
      console.error('Gemini generation error:', err.response?.data || err);
      return 'Xin lỗi, hệ thống chatbot đang gặp lỗi. Vui lòng thử lại!';
    }
  }
}