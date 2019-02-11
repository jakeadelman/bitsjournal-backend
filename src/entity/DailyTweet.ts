import { Entity, Column, PrimaryColumn } from "typeorm";
import { ObjectType, Field } from "type-graphql";

@ObjectType()
@Entity()
export class DailyTweet {
  @Field()
  @PrimaryColumn()
  day: number;

  @Field()
  @Column()
  positive: number;

  @Field()
  @Column()
  negative: number;

  @Field()
  @Column()
  total: number;
}
