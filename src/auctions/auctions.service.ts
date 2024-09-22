import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { UpdateAuctionDto } from './dto/update-auction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Auction } from './entities/auction.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuctionsService {
  constructor(
    @InjectRepository(Auction) private auctionRepository: Repository<Auction>,
    private readonly usersService: UsersService,
  ) {}

  async createAuction(
    createAuctionDto: CreateAuctionDto,
    user: any,
  ): Promise<Auction> {
    const fullUser = await this.usersService.findById(user.userId);
    const auction = this.auctionRepository.create({
      ...createAuctionDto,
      user: fullUser,
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

  async findAllByUserId(id: number): Promise<Auction[]> {
    return await this.auctionRepository.find({
      relations: ['user', 'bids'],
      where: { user: { id } },
    });
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

  async deleteAuction(id: number, user: any): Promise<void> {
    const auction = await this.findOne(id);
    if (auction.user.id !== user.userId) {
      throw new NotFoundException('You are not the owner of this auction');
    }
    await this.auctionRepository.remove(auction);
  }
}
