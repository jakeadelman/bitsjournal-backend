import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne
} from "typeorm";
import { Photo } from "./instaPhoto";
import { User } from "../User";

@Entity()
export class InstaUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Photo, photo => photo.user, { nullable: true })
  photos: Photo[];

  @ManyToOne(() => User, user => user.instagramUsers)
  user: User;
}
