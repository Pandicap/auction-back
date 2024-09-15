import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Auction } from './entities/auction.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class AuctionsService {
  constructor(
    @InjectRepository(Auction) private auctionRepository: Repository<Auction>,
  ) {}

  async createAuction(
    createAuctionDto: CreateAuctionDto,
    user: User,
  ): Promise<Auction> {
    const auction = this.auctionRepository.create({
      ...createAuctionDto,
      user,
    });
    await this.auctionRepository.save(auction);
    return auction;
  }

  async findAll(): Promise<Auction[]> {
    return await this.auctionRepository.find({ relations: ['user', 'bids'] });
  }

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

  async deleteAuction(id: number, user: User): Promise<void> {
    const auction = await this.findOne(id);
    if (auction.user.id !== user.id) {
      throw new NotFoundException('You are not the owner of this auction');
    }
    await this.auctionRepository.remove(auction);
  }
}
