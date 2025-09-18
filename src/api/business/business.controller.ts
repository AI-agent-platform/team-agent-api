import {
  Controller,
  Post,
  Body,
  Logger,
  UseGuards,
  Request,
  Get,
} from "@nestjs/common";
import { BusinessService } from "./business.service";
import { JwtAuthGuard } from "../auth/jwt-auth.gaurd";

@Controller("business")
export class BusinessController {
  private readonly logger = new Logger(BusinessController.name);

  constructor(private readonly businessService: BusinessService) {}

  @Post("create")
  @UseGuards(JwtAuthGuard)
  async createBusiness(@Request() req, @Body() body: any) {
    const uid = req.user?._id;
    try {
      const business = await this.businessService.create(uid, body);
      return { uid: business._id, message: "Business created successfully" };
    } catch (err) {
      this.logger.error(err);
      throw err;
    }
  }

  @Get("my-business")
  @UseGuards(JwtAuthGuard)
  async getMyBusiness(@Request() req) {
    const uid = req.user?._id;

    return this.businessService.findByUser(uid);
  }

//   @Post("fields")
//   async selectFields(@Body() body: { businessId: string; fields: string[] }) {
//     return this.businessService.addFields(body.businessId, body.fields);
//   }

//   @Post("upload-file")
//   async uploadFile(
//     @Body() body: { businessId: string; fileName: string; url: string }
//   ) {
//     return this.businessService.addFile(
//       body.businessId,
//       body.fileName,
//       body.url
//     );
//   }

//   @Post("create-agents")
//   async createAgents(@Body() body: { businessId: string }) {
//     return this.businessService.createAgents(body.businessId);
//   }
}
