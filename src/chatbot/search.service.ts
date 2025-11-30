import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KbDocument } from './entities/kb_document.entity';
import { KbEmbedding } from './entities/kb_embedding.entity';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SearchService {
  private readonly EMBED_URL_TEMPLATE =
    'https://generativelanguage.googleapis.com/v1beta/models/{model}:batchEmbedContents';

  constructor(
    @InjectRepository(KbDocument)
    private docRepo: Repository<KbDocument>,
    @InjectRepository(KbEmbedding)
    private embRepo: Repository<KbEmbedding>,
    private readonly http: HttpService,
  ) {}

  private getEmbedUrl() {
    const model = process.env.GEMINI_EMBED_MODEL || 'gemini-embedding-001';
    return this.EMBED_URL_TEMPLATE.replace('{model}', model) + `?key=${process.env.GEMINI_API_KEY}`;
  }

  // compute cosine similarity
  private cosine(a: number[], b: number[]) {
    const dot = a.reduce((s, ai, i) => s + ai * (b[i] ?? 0), 0);
    const na = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
    const nb = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
    if (na === 0 || nb === 0) return 0;
    return dot / (na * nb);
  }

  // convert stored JSON to number[]
  private parseEmbedding(row: KbEmbedding): number[] {
    try {
      const arr = JSON.parse(row.embedding);
      if (Array.isArray(arr)) return arr.map((v) => Number(v));
      return [];
    } catch {
      return [];
    }
  }

  // 1) embed query text
  async embedQuery(text: string): Promise<number[]> {
    const embedUrl = this.getEmbedUrl();
    const reqBody = { requests: [{ content: text }] };

    const resp = await firstValueFrom(this.http.post(embedUrl, reqBody, { headers: { 'Content-Type': 'application/json' } }));

    const embeddingVec =
      resp.data?.responses?.[0]?.embeddings?.[0] ||
      resp.data?.embeddings?.[0] ||
      resp.data?.data?.[0]?.embedding ||
      null;

    return embeddingVec || [];
  }

  // 2) search top-k
  async semanticSearch(query: string, topK = 5) {
    const qVec = await this.embedQuery(query);
    const rows = await this.embRepo.find({ relations: ['document'] });

    const scored = rows.map((row) => {
      const vec = this.parseEmbedding(row);
      const score = this.cosine(qVec, vec);
      return { row, doc: (row as any).document, score };
    });

    scored.sort((a, b) => b.score - a.score);

    const top = scored.slice(0, topK).map((s) => ({
      id: s.doc.id,
      title: s.doc.title,
      content: s.doc.content,
      source_url: s.doc.source_url,
      score: s.score,
    }));

    return top;
  }
}
