import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { BidsService } from './bids.service';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('bids')
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createBidDto: CreateBidDto, @Request() req) {
    return this.bidsService.createBid(createBidDto, req.user);
  }

  @Get()
  findAll() {
    return this.bidsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('for-user')
  findForUser(@Request() req) {
    return this.bidsService.findAllByUserId(req.user.userId);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.bidsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateBidDto: UpdateBidDto,
    @Request() req,
  ) {
    return this.bidsService.updateBid(id, updateBidDto, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number, @Request() req) {
    return this.bidsService.deleteBid(id, req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('complete-payment/:id')
  completePayment(@Param('id') id: number) {
    return this.bidsService.completePayment(id);
  }
}
