import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { KbDocument } from './kb_document.entity';

@Entity({ name: 'kb_embeddings' })
export class KbEmbedding {
  @PrimaryGeneratedColumn()
  id: number;

  // Lưu vector embedding dưới dạng JSON string
  @Column({ type: 'longtext' })
  embedding: string;

  @ManyToOne(() => KbDocument, (doc) => doc.embeddings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'document_id' })
  document: KbDocument;
}