import { Entity, Column } from "typeorm";
import { ObjectType, Field } from "type-graphql";

@ObjectType()
@Entity()
export class Tweet {
  @Field()
  @Column()
  query: string;

  @Field()
  @Column()
  tweetId: string;
}
