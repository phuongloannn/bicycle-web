import { Controller, Post, Body } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { RagService } from './rag.service';
import { SearchService } from './search.service';

@Controller('api/chat')
export class ChatbotController {
  constructor(
    private readonly chatbotService: ChatbotService,
    private readonly ragService: RagService,
    private readonly searchService: SearchService,
  ) {}

  @Post('send')
  async send(@Body() body: { message: string; useRag?: boolean }) {
    const { message, useRag } = body;

    let contextText = '';
    if (useRag) {
      const docs = await this.searchService.semanticSearch(message, 3);
      if (docs.length) {
        contextText = docs
          .map((d) => `DOCUMENT: ${d.title}\n${d.content}`)
          .join('\n\n');
      }
    }

    const finalPrompt = contextText
      ? `${contextText}\n\nUSER: ${message}\n\nAssistant:`
      : message;

    const reply = await this.chatbotService.askAI(finalPrompt);

    return { reply };
  }

  @Post('doc')
  async createDoc(
    @Body()
    payload: { doc_type: string; title?: string; content: string; source_url?: string },
  ) {
    return this.ragService.createDocumentAndEmbed(payload);
  }

  @Post('search')
  async search(@Body() payload: { query: string; topK?: number }) {
    const top = await this.searchService.semanticSearch(
      payload.query,
      payload.topK || 5,
    );
    return { results: top };
  }
}