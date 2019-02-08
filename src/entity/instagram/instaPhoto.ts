import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { InstaUser } from "./instaUser";

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @ManyToOne(() => InstaUser, user => user.photos)
  user: InstaUser;
}
