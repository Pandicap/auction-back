import { Bid } from 'src/bids/entities/bid.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Auction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  startingPrice: number;

  @Column()
  endTime: Date;

  @Column()
  isValid: boolean;

  @Column()
  lastestBid: number;

  @Column()
  images: string;

  @OneToMany(() => Bid, (bid) => bid.auction)
  bids: Bid[];

  @ManyToOne(() => User, (user) => user.auctions)
  user: User;
}
