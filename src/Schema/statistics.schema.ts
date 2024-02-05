import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StatisticsDocument = Statistics & Document;

@Schema()
export class Statistics {
  @Prop()
  shortUrl: string;

  @Prop()
  longUrl: string;

  @Prop({ type: Number, default: 0 })
  visitCount: number;

  @Prop()
  ip: string;

  @Prop()
  lastVisited: Date;
}

export const StatisticsSchema = SchemaFactory.createForClass(Statistics);
