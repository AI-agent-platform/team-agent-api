import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Business } from "./model/business.model";
import { User } from "../user/model/user.model";

@Injectable()
export class BusinessService {
  constructor(
    @InjectModel(Business.name) private businessModel: Model<Business>,
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  async create(uid: string, body: any): Promise<Business> {
    const { name, contact, email, field } = body;
    const user = await this.userModel.findById(uid);
    if (!user) throw new NotFoundException("User not found");

    const business = new this.businessModel({
      name,
      contact,
      email,
      field,
      ownerUid: uid,
    });
    await business.save();

    user.businesses.push(business._id);
    await user.save();

    return business;
  }

  //   async addFields(businessId: string, fields: string[]) {
  //     const business = await this.businessModel.findById(businessId);
  //     if (!business) throw new NotFoundException("Business not found");

  //     business.fields.push(...fields.filter((f) => !business.fields.includes(f)));
  //     await business.save();
  //     return { message: "Fields added" };
  //   }

  //   async addFile(businessId: string, fileName: string, url: string) {
  //     const business = await this.businessModel.findById(businessId);
  //     if (!business) throw new NotFoundException("Business not found");

  //     business.files.push({ fileName, url });
  //     await business.save();
  //     return { message: "File added" };
  //   }

  //   async createAgents(businessId: string) {
  //     const business = await this.businessModel.findById(businessId);
  //     if (!business) throw new NotFoundException("Business not found");

  //     // Example dummy agent URLs
  //     business.agentData = {
  //       adminUrl: `https://admin.example.com/${businessId}`,
  //       clientUrl: `https://client.example.com/${businessId}`,
  //     };

  //     await business.save();
  //     return {
  //       adminUrl: business.agentData.adminUrl,
  //       clientUrl: business.agentData.clientUrl,
  //     };
  //   }

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
