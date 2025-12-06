import { HttpException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Business } from "./model/business.model";
import { User } from "../user/model/user.model";
import axios from "axios";
import { EmailService } from "../email/email.service";
import { UpdateBusinessDto } from "./dto/create-business.dto";
import * as dotenv from "dotenv";
import { loadPdfAttachment } from "src/helpers/generate-pdf-buffer";
dotenv.config();

@Injectable()
export class BusinessService {
  constructor(
    @InjectModel(Business.name) private businessModel: Model<Business>,
    @InjectModel(User.name) private userModel: Model<User>,
    private mailService: EmailService
  ) {}

  async create(uid: string, body: any): Promise<Business> {
    const { name, contact, email, field } = body;
    const user = await this.userModel.findById(uid);
    if (!user) throw new NotFoundException("User not found");

    // Forward data to FastAPI server
    try {
      const res = await axios.post(
        `${process.env.FASTAPI_URL}/v1/businesses/`,
        {
          company_uuid: uid,
          company_email: email,
          business_name: name,
          contact_number: contact,
          field: field,
        }
      );
    } catch (err) {
      throw new HttpException(
        err || err.response?.data.detail || err.message.detail,
        err.response?.status || 500
      );
    }

    const business = new this.businessModel({
      name,
      contact,
      email,
      field,
      ownerUid: uid,
    });

    await business.save();

    //prepare email attachment
    const attachments = [];
    const pdfAttachment = await loadPdfAttachment("welcome.pdf");
    if (pdfAttachment) {
      attachments.push(pdfAttachment);
    }
    //Send email with endpoints
    await this.mailService.sendEmail(
      email,
      "Congratulations for creating your first agents with us!",
      "email-create-business",
      {
        businessAgent: `${process.env.AGENT_BUSINESS_URL}/${uid}`,
        customerAgent: `${process.env.AGENT_CUSTOMER_URL}/${uid}`,
        BusinessName: name,
      }
    );

    // TODO: Add business to user's businesses array and save user
    // user.businesses.push(business._id);
    // await user.save();

    return business;
  }

  async findBusinessByUserId(uid: string) {
    const business = await this.businessModel.findOne({ ownerUid: uid }).lean();

    if (!business) {
      return { data: {} };
    }
    return { data: business };
  }

  async uploadCompanyData(uid: string, file: any) {
    const business = await this.businessModel.findOne({ ownerUid: uid });
    if (!business) throw new NotFoundException("Business not found");

    try {
      const FormData = require("form-data");
      const { Readable } = require("stream");

      // Create FormData instance
      const formData = new FormData();

      // Convert buffer to stream
      const bufferStream = Readable.from(file.buffer);
      formData.append("csv_file", bufferStream, file.originalname);

      // Append business_uuid
      formData.append("business_uuid", uid);

      const FastAPIResponse = await axios.post(
        `${process.env.FASTAPI_URL}/v1/documents/ingest/csv/`,
        formData,
        {
          headers: formData.getHeaders(),
        }
      );

      return {
        business_uid: uid,
        message: "File uploaded successfully",
        data: FastAPIResponse.data,
      };
    } catch (err) {
      console.error("Upload error:", err);
      throw new HttpException(
        err?.response?.data?.detail || err?.message || "Upload failed",
        err?.response?.status || 500
      );
    }
  }

  async update(uid: string, payload: UpdateBusinessDto) {
    const business = await this.businessModel.findOne({ ownerUid: uid });
    if (!business) {
      throw new NotFoundException("Business not found");
    }

    const updatedBusiness = await this.businessModel.findOneAndUpdate(
      { ownerUid: uid },
      { $set: payload },
      { new: true }
    );

    return updatedBusiness;
  }
}
