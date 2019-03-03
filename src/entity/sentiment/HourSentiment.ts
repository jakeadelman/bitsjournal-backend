import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
@Entity()
export class HourSentiment {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  hour: number;

  @Field()
  @Column({ type: "float" })
  sentiment: number;

  @Field()
  @Column()
  term: string;

  @Field()
  @Column()
  num_tweets: number;
}
