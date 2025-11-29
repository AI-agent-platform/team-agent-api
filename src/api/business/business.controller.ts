import {
  Controller,
  Post,
  Body,
  Logger,
  UseGuards,
  Request,
  Get,
  UseInterceptors,
  UploadedFile,
  Put,
} from "@nestjs/common";
import { BusinessService } from "./business.service";
import { JwtAuthGuard } from "../auth/jwt-auth.gaurd";
import {
  CreateBusinessDto,
  UpdateBusinessDto,
  UploadFileDto,
} from "./dto/create-business.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from "express";

@Controller("business")
export class BusinessController {
  private readonly logger = new Logger(BusinessController.name);

  constructor(private readonly businessService: BusinessService) {}

  @Post("create")
  @UseGuards(JwtAuthGuard)
  async createBusiness(@Request() req, @Body() body: CreateBusinessDto) {
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

    return this.businessService.findBusinessByUserId(uid);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateBusiness(@Request() req, @Body() body: UpdateBusinessDto) {
    const uid = req.user?._id;
    return this.businessService.update(uid, body);
  }

  @Post("upload-file")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("file"))
  async uploadFile(@Request() req, @UploadedFile() file: Express.Multer.File) {
    return this.businessService.uploadCompanyData(req.user?._id, file);
  }
}
