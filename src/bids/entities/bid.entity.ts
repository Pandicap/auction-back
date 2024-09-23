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

  @Column({ default: false })
  isWinning: boolean;

  @Column({ default: false })
  paymentDone: boolean;

  @ManyToOne(() => User, (user) => user.bids)
  user: User;

  @ManyToOne(() => Auction, (auction) => auction.bids, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  auction: Auction;
}
