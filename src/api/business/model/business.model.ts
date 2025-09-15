import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { BusinessType } from "src/constants/business-types.enum";

@Schema({ timestamps: true })
export class Business extends Document {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  contact: string;
  @Prop({ required: true })
  email: string;
  @Prop()
  field: BusinessType;

  @Prop({ required: true })
  ownerUid: string;

  // @Prop({ type: [String], default: [] })
  // fields: string[];

  // @Prop({ type: [{ fileName: String, url: String }], default: [] })
  // files: { fileName: string; url: string }[];

  // @Prop({ type: Object, default: {} })
  // agentData: { adminUrl?: string; clientUrl?: string };
}

export const BusinessSchema = SchemaFactory.createForClass(Business);
