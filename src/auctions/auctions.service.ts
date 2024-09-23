import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Auction } from './entities/auction.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Bid } from 'src/bids/entities/bid.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class AuctionsService {
  constructor(
    @InjectRepository(Auction) private auctionRepository: Repository<Auction>,
    @InjectRepository(Auction) private bidRepository: Repository<Bid>,
    private readonly usersService: UsersService,
  ) {}

  // Funksioni per te krijuar nje ankand
  async createAuction(
    createAuctionDto: CreateAuctionDto,
    user: any,
  ): Promise<Auction> {
    const fullUser = await this.usersService.findById(user.userId);
    const auction = this.auctionRepository.create({
      ...createAuctionDto,
      isValid: true,
      lastestBid: 0,
      user: fullUser,
    });
    await this.auctionRepository.save(auction);
    return auction;
  }

  // Funksioni per te marre te gjihe ankandet
  async findAll(): Promise<Auction[]> {
    return await this.auctionRepository.find({ relations: ['user', 'bids'] });
  }

  // Funksioni per te marre nje ankand
  async findOne(id: number): Promise<Auction> {
    const auction = await this.auctionRepository.findOne({
      where: { id },
      relations: ['user', 'bids'],
    });
    if (!auction) {
      throw new NotFoundException(`Auction with ID ${id} not found`);
    }
    return auction;
  }

  // Funksioni per te marre ankandet e nje perdoruesi
  async findAllByUserId(id: number): Promise<Auction[]> {
    return await this.auctionRepository.find({
      relations: ['user', 'bids'],
      where: { user: { id } },
    });
  }

  // Funksioni per te perditesuar nje ankand
  async updateAuction(
    id: number,
    updateAuctionDto: UpdateAuctionDto,
    user: User,
  ): Promise<Auction> {
    const auction = await this.findOne(id);
    if (auction.user.id !== user.id) {
      throw new NotFoundException('You are not the owner of this auction');
    }

    Object.assign(auction, updateAuctionDto);
    await this.auctionRepository.save(auction);
    return auction;
  }

  // Funksioni per te fshire nje ankand
  async deleteAuction(id: number, user: any): Promise<void> {
    const auction = await this.findOne(id);
    if (auction.user.id !== user.userId) {
      throw new NotFoundException('You are not the owner of this auction');
    }
    await this.auctionRepository.remove(auction);
  }

  // Funksioni i skeduluar per te bere nje ankand te pa vlefshem kur arrin kohen e perfundimit
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async invalidateAuction() {
    const auctions = await this.auctionRepository.find({
      relations: ['user', 'bids'],
    });
    const currentTime = new Date();

    for (const auction of auctions) {
      if (auction.endTime && auction.endTime < currentTime && auction.isValid) {
        auction.isValid = false;
        const maxBid = auction.bids.reduce((prev, current) => {
          return prev && prev.amount > current.amount ? prev : current;
        });
        maxBid.isWinning = true;
        await this.bidRepository.update(maxBid.id, maxBid);
        await this.auctionRepository.update(auction.id, auction);
      }
    }
  }
}
