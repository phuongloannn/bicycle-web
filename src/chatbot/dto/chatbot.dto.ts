import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class AskDto {
  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsOptional()
  sessionId?: string;
}