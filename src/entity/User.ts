import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  OneToMany,
  ManyToMany
} from "typeorm";
import { ObjectType, Field, ID, Root } from "type-graphql";
import { IsEmailAlreadyExist } from "../modules/user/register/isEmailAlreadyExist";
import { InstaUser } from "./instagram/instaUser";
import { SearchTerm } from "./SearchTerm";

@ObjectType()
@Entity("users")
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  firstName: string;

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

  @Column("bool", { default: false })
  confirmed: boolean;

  // @Column("simple-array", { nullable: true })
  // instagramUsers: string[];
  @ManyToMany(() => SearchTerm, searchterm => searchterm.users, {
    nullable: true
  })
  searchterms: SearchTerm[];

  @OneToMany(() => InstaUser, instagramUser => instagramUser.user)
  instagramUsers: InstaUser[];
}
