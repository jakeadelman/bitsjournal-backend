import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinTable
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import { Currency } from "./Currency";

@ObjectType()
@Entity("searchterm")
export class SearchTerm {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ unique: true })
  term: string;

  @ManyToOne(() => Currency, currency => currency.terms)
  @JoinTable()
  currency: Currency;
}
