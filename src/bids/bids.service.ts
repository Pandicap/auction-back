import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Bid } from './entities/bid.entity';
import { Repository } from 'typeorm';
import { Auction } from 'src/auctions/entities/auction.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class BidsService {
  constructor(
    @InjectRepository(Bid) private bidRepository: Repository<Bid>,
    @InjectRepository(Auction) private auctionRepository: Repository<Auction>,
    private readonly usersService: UsersService,
  ) {}

  async createBid(createBidDto: CreateBidDto, user: any): Promise<Bid> {
    const { amount, time, auctionId } = createBidDto;
    const auction = await this.auctionRepository.findOne({
      where: { id: auctionId },
    });
    const fullUser = await this.usersService.findById(user.userId);
    if (!auction) {
      throw new NotFoundException('Auction not found');
    }

    const bid = this.bidRepository.create({
      amount,
      time,
      isWinning: false,
      auction,
      user: fullUser,
    });

    // TODO: change for other crud operations
    await this.bidRepository.save(bid);
    await this.auctionRepository.update(auction.id, { lastestBid: amount });
    return bid;
  }

  async findAll(): Promise<Bid[]> {
    return this.bidRepository.find({ relations: ['user', 'auction'] });
  }

  async findOne(id: number): Promise<Bid> {
    const bid = await this.bidRepository.findOne({
      where: { id },
      relations: ['user', 'auction'],
    });
    if (!bid) {
      throw new NotFoundException(`Bid with ID ${id} not found`);
    }
    return bid;
  }

  async findAllByUserId(id: number): Promise<Bid[]> {
    return await this.bidRepository.find({
      relations: ['user', 'auction'],
      where: { user: { id } },
    });
  }

  async updateBid(
    id: number,
    updateBidDto: UpdateBidDto,
    user: User,
  ): Promise<Bid> {
    const bid = await this.findOne(id);
    if (bid.user.id !== user.id) {
      throw new NotFoundException('You are not the owner of this bid');
    }

    Object.assign(bid, updateBidDto);
    await this.bidRepository.save(bid);
    return bid;
  }

  async deleteBid(id: number, user: any): Promise<void> {
    const bid = await this.findOne(id);
    if (bid.user.id !== user.userId) {
      throw new NotFoundException('You are not the owner of this bid');
    }
    await this.bidRepository.remove(bid);
  }

  async completePayment(bidId: number) {
    return await this.bidRepository.update(bidId, { paymentDone: true });
  }
}
