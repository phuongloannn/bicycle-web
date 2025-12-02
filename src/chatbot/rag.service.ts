import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { KbDocument } from './entities/kb_document.entity';
import { KbEmbedding } from './entities/kb_embedding.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RagService {
  private readonly EMBED_URL_TEMPLATE =
    'https://generativelanguage.googleapis.com/v1beta/models/{model}:batchEmbedContents';

  constructor(
    @InjectRepository(KbDocument)
    private readonly docRepo: Repository<KbDocument>,

    @InjectRepository(KbEmbedding)
    private readonly embRepo: Repository<KbEmbedding>,

    private readonly http: HttpService,
  ) {}

  private getEmbedUrl(): string {
    const model = process.env.GEMINI_EMBED_MODEL || 'gemini-embedding-001';
    return (
      this.EMBED_URL_TEMPLATE.replace('{model}', model) +
      `?key=${process.env.GEMINI_API_KEY}`
    );
  }

  // Create document + embedding
  async createDocumentAndEmbed(payload: {
    doc_type: string;
    title?: string;
    content: string;
    source_url?: string;
  }) {
    // 1) Create document (ép kiểu rõ ràng để TypeScript chọn overload đúng)
    const docPayload = {
      doc_type: payload.doc_type,
      title: payload.title ?? null,
      content: payload.content,
      source_url: payload.source_url ?? null,
    } as DeepPartial<KbDocument>;

    const doc = this.docRepo.create(docPayload);
    const savedDoc = await this.docRepo.save(doc);

    // 2) Prepare embedding API call
    const embedUrl = this.getEmbedUrl();
    const reqBody = {
      requests: [{ content: payload.content }],
    };

    try {
      const resp = await firstValueFrom(
        this.http.post(embedUrl, reqBody, {
          headers: { 'Content-Type': 'application/json' },
        }),
      );

      // 3) Extract embedding array safely (many API shapes)
      const embeddingVec =
        resp.data?.responses?.[0]?.embeddings?.[0] ??
        resp.data?.embeddings?.[0] ??
        resp.data?.data?.[0]?.embedding ??
        [];

      // 4) Save embedding (ép kiểu DeepPartial cho create)
      const embPayload = {
        embedding: JSON.stringify(embeddingVec),
        // cast savedDoc to KbDocument to avoid "KbDocument[] not assignable" confusion
        document: savedDoc as KbDocument,
      } as DeepPartial<KbEmbedding>;

      const embEntity = this.embRepo.create(embPayload);
      await this.embRepo.save(embEntity);

      return {
        doc: savedDoc,
        embedding: embeddingVec,
      };
    } catch (err) {
      console.error('Embedding API Error:', err?.response?.data ?? err);
      return {
        doc: savedDoc,
        embedding: [],
      };
    }
  }
}