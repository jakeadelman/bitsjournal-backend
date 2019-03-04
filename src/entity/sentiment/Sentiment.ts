import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
@Entity()
export class Sentiment {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => [Number])
  @Column("int", { array: true })
  time: number[];

  @Field(() => [Number])
  @Column({ array: true, type: "float" })
  sentiment: number[];

  @Field()
  @Column()
  currency: string;

  @Field(() => [Number])
  @Column("int", { array: true })
  num_tweets: number[];
}
