import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UrlDocument = Url & Document;

@Schema()
export class Url {
  @Prop()
  shortUrl: string;

  @Prop()
  longUrl: string;

  @Prop({ type: Number, default: 0 })
  requestLimit: number;

  @Prop()
  createdOn: Date;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ type: Date, default: null })
  deletedOn: Date;
}

export const UrlSchema = SchemaFactory.createForClass(Url);
