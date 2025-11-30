import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';

import { ChatbotController } from './chatbot.controller';
import { ChatbotService } from './chatbot.service';
import { RagService } from './rag.service';
import { SearchService } from './search.service';

import { KbDocument } from './entities/kb_document.entity';
import { KbEmbedding } from './entities/kb_embedding.entity';
// import { Message } from './entities/message.entity'; // không cần nữa

@Module({
  imports: [
    TypeOrmModule.forFeature([KbDocument, KbEmbedding]), // bỏ Message
    HttpModule,
  ],
  controllers: [ChatbotController],
  providers: [ChatbotService, RagService, SearchService],
  exports: [ChatbotService, RagService, SearchService],
})
export class ChatbotModule {}
