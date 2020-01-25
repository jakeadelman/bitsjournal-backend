import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany
} from "typeorm";
import { Trade } from "./Trade";
import { ObjectType, Field, ID, Root } from "type-graphql";
import { IsEmailAlreadyExist } from "../modules/user/register/isEmailAlreadyExist";
@ObjectType()
@Entity("users")
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  firstName: string;
  //

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column("text", { unique: true })
  @IsEmailAlreadyExist()
  email: string;

  @Field()
  name(@Root() parent: User): string {
    return `${parent.firstName} ${parent.lastName}`;
  }

  @Column()
  password: string;

  @Column("bool", { default: true })
  confirmed: boolean;

  @Column({ default: "none" })
  apiKeyID: string;

  @Column({ default: "none" })
  apiKeySecret: string;

  @OneToMany(
    () => Trade,
    trade => trade.user
  )
  trades: Trade[];
}
