import { ObjectType, Field } from "type-graphql";
// import { PrimaryGeneratedColumn } from "typeorm";

@ObjectType()
export class GoogleTrends {
  //   @Field(() => ID)
  //   @PrimaryGeneratedColumn()
  //   id: number;

  @Field(() => String)
  time: string;

  @Field(() => String)
  formattedTime: string;

  @Field(() => String)
  formattedAxisTime: string;

  @Field(() => [Number])
  value: number[];

  @Field(() => [Boolean])
  hasData: boolean[];

  @Field(() => [String])
  formattedValue: string[];
}
