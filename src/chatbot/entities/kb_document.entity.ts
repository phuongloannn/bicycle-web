import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { KbEmbedding } from './kb_embedding.entity';

@Entity({ name: 'kb_documents' })
export class KbDocument {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ['product', 'faq', 'other'], default: 'other' })
  doc_type: 'product' | 'faq' | 'other';

  @Column({ length: 255, nullable: true })
  title?: string;

  @Column({ type: 'longtext' })
  content: string;

  @Column({ length: 500, nullable: true })
  source_url?: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => KbEmbedding, (emb) => emb.document)
  embeddings: KbEmbedding[];
}
