import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinTable
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { SearchTerm } from "./SearchTerm";

@ObjectType()
@Entity("currency")
export class Currency {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  name: string;

  @Field()
  @Column({ nullable: true })
  ticker: string;

  @Column("text", { nullable: true, array: true })
  additional_terms: string[];

  @OneToMany(() => SearchTerm, term => term.currency, { nullable: true })
  @JoinTable()
  terms: SearchTerm[];
}
