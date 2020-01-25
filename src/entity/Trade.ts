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
  timestamp: string;

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
  @Column()
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
  @Column()
  trdStart: boolean;

  @Field()
  @Column()
  trdEnd: boolean;
}
