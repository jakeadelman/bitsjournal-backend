import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
@Entity()
export class Tweet {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  query: string;

  @Field()
  @Column({ unique: true })
  tweetId: string;

  @Field()
  @Column()
  timestamp: string;

  @Field()
  @Column()
  currHour: string;

  @Field()
  @Column()
  hour: string;

  @Field()
  @Column()
  screenName: string;

  @Field()
  @Column()
  isPinned: boolean;

  @Field()
  @Column()
  isRetweet: boolean;

  @Field()
  @Column()
  isReplyTo: boolean;

  @Field()
  @Column()
  text: string;

  @Field()
  @Column()
  userMentions: string;

  @Field()
  @Column()
  hashtags: string;

  @Field()
  @Column()
  images: string;

  @Field()
  @Column()
  urls: string;

  @Field()
  @Column()
  replyCount: number;

  @Field()
  @Column()
  retweetCount: number;

  @Field()
  @Column()
  favoriteCount: number;

  @Field()
  @Column()
  polarity: number;
}
