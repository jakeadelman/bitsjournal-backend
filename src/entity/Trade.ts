import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  JoinTable
} from "typeorm";
import { User } from "./User";
import { ObjectType, Field, ID } from "type-graphql";
@ObjectType()
@Entity("trades")
export class Trade extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => User,
    user => user.trades
  )
  @JoinTable()
  user: User;

  @Field()
  @Column({ unique: true })
  execID: string;

  @Field()
  @Column()
  tradeNum: number;

  @Field()
  @Column()
  searchTimestamp: string;

  @Field()
  @Column()
  timestamp: string;

  @Field()
  @Column({ nullable: true })
  price: string;

  @Field()
  @Column()
  side: string;

  @Field()
  @Column()
  orderQty: number;

  @Field()
  @Column()
  leavesQty: number;

  @Field()
  @Column({ nullable: true })
  currentQty: number;

  @Field()
  @Column()
  avgEntryPrice: string;

  @Field()
  @Column()
  execType: string;

  @Field()
  @Column()
  orderType: string;

  @Field()
  @Column({ nullable: true })
  execGrossPnl: number;

  @Field()
  @Column({ nullable: true })
  realizedPnl: number;

  @Field()
  @Column({ nullable: true })
  commission: string;

  @Field()
  @Column()
  trdStart: boolean;

  @Field()
  @Column()
  trdEnd: boolean;

  @Field()
  @Column({ nullable: true })
  notes: string;

  @Field()
  @Column({ nullable: true })
  hashtags: string;
}
