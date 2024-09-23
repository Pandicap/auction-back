import { Module } from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { AuctionsController } from './auctions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auction } from './entities/auction.entity';
import { UsersModule } from 'src/users/users.module';
import { Bid } from 'src/bids/entities/bid.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Auction, Bid]), UsersModule],
  controllers: [AuctionsController],
  providers: [AuctionsService],
})
export class AuctionsModule {}
