import { BaseEntity } from "src/common/base.entity";
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('topics')
export class Topic extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ nullable: true, type: 'text' })
  description: string | null;
}