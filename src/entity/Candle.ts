import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
// import { SearchTerm } from "./SearchTerm";

@ObjectType()
@Entity("candle")
export class Candle {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  uniquekey: string;

  @Field()
  @Column()
  timestamp: string;

  @Field()
  @Column()
  symbol: string;

  @Field()
  @Column()
  open: string;

  @Field()
  @Column()
  high: string;

  @Field()
  @Column()
  low: string;

  @Field()
  @Column()
  close: string;

  @Field()
  @Column()
  trades: string;

  @Field()
  @Column()
  volume: string;

  @Field()
  @Column()
  vwap: string;

  @Field()
  @Column()
  lastSize: string;

  @Field()
  @Column()
  turnover: string;

  @Field()
  @Column()
  homeNotional: string;

  @Field()
  @Column()
  foreignNotional: string;
}

// "timestamp": "2015-09-25T12:05:00.000Z",
// "symbol": "XBTUSD",
// "open": null,
// "high": null,
// "low": null,
// "close": null,
// "trades": 0,
// "volume": 0,
// "vwap": null,
// "lastSize": null,
// "turnover": 0,
// "homeNotional": 0,
// "foreignNotional": 0
// },
