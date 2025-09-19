import { HttpException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Business } from "./model/business.model";
import { User } from "../user/model/user.model";
import { fastAPIConfig } from "../../configurations/fastAPIConfig";
import axios from "axios";
import { EmailService } from "../email/email.service";

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

    // 🔥 Forward data to FastAPI server
    try {
      await axios.post(`${fastAPIConfig.uri}/v1/businesses/`, {
        company_uuid: uid,
        company_email: email,
        business_name: name,
        contact_number: contact,
        field: field,
      });
    } catch (err) {      
      throw new HttpException(err.response?.data.detail || err.message.detail, err.response?.status || 500);
    }

    //save in MongoDB
    const business = new this.businessModel({
      name,
      contact,
      email,
      field,
      ownerUid: uid,
    });

    await business.save();
    await this.mailService.sendEmail(
      email,
      'Congratulation for creating your first agents with us!',
      'email-create-business',
      { name: 'user', orgName: name }
    );
    // user.businesses.push(business._id);
    // await user.save();

    return business;
  }

  async findByUser(uid: string) {
    const business = await this.businessModel.findOne({ ownerUid: uid }).lean();

    if (!business) {
      return { completedSteps: [], data: {} };
    }

    const completedSteps: number[] = [];
    if (business.name && business.contact && business.email && business.field) {
      completedSteps.push(0, 1, 2, 3);
    }
    // if (business.fields?.length) {
    //   completedSteps.push(4);
    // }
    // if (business.files?.length) {
    //   completedSteps.push(5);
    // }
    // if (business.agentsCreated) {
    //   completedSteps.push(5);
    // }

    return { completedSteps, data: business };
  }
}
