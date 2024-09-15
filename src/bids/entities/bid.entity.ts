import { Auction } from 'src/auctions/entities/auction.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Bid {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column()
  time: string;

  @ManyToOne(() => User, (user) => user.bids)
  user: User;

  @ManyToOne(() => Auction, (auction) => auction.bids)
  auction: Auction;
}
