import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { ObjectType, Field } from "type-graphql";

@ObjectType()
@Entity()
export class DailyTweet {
  @Field()
  @PrimaryGeneratedColumn()
  query: string;

  @Field()
  @Column()
  tweetId: string;
}
