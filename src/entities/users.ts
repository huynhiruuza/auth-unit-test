import {
  BeforeInsert,
  BeforeUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';

enum RoleEnum {
  ADMIN = 'Admin',
  INVESTIGATOR = 'Investigator',
}

@Entity('users')
@Index(['role'], { unique: false })
export class User {
  @Column({ type: 'integer', primary: true })
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, type: 'timestamp' })
  @CreateDateColumn()
  created_at: Date;

  @Column({ nullable: true, type: 'timestamp' })
  @UpdateDateColumn()
  updated_at: Date;

  @Column({ nullable: false, type: 'varchar', default: '' })
  encrypted_password = '';

  @Column({ nullable: false, type: 'varchar', unique: true })
  email: string;

  @Column({ nullable: true, type: 'varchar', unique: true })
  reset_password_token: string;

  @Column({ nullable: true, type: 'timestamp' })
  reset_password_sent_at: Date;

  @Column({ nullable: true, type: 'timestamp' })
  remember_created_at: Date;

  @Column({ nullable: true, type: 'timestamp' })
  current_sign_in_at: Date;

  @Column({ nullable: true, type: 'timestamp' })
  last_sign_in_at: Date;

  @Column({ nullable: true, type: 'varchar' })
  current_sign_in_ip: string;

  @Column({ nullable: true, type: 'varchar' })
  last_sign_in_ip: string;

  @Column({ nullable: false, type: 'integer', default: 0 })
  sign_in_count = 0;

  @Column({ nullable: true, type: 'varchar' })
  password: string;

  @Column({ nullable: true, type: 'varchar' })
  password_confirmation: string;

  @Column({ nullable: true, type: 'timestamp' })
  locked_at: Date;

  @Column({ nullable: false, type: 'integer', default: 0 })
  failed_attempts = 0;

  @Column({ nullable: true, type: 'varchar', unique: true })
  unlock_token: string;

  @Column({ nullable: true, type: 'varchar', unique: true })
  confirmation_token: string;

  @Column({ nullable: true, type: 'varchar', unique: true })
  unconfirmed_email: string;

  @Column({ nullable: true, type: 'timestamp' })
  confirmed_at: Date;

  @Column({ nullable: true, type: 'timestamp' })
  confirmation_sent_at: Date;

  @Column({
    nullable: false,
    type: 'enum',
    enum: ['Admin', 'Investigator'],
    default: 'Admin',
  })
  role: `${RoleEnum}` = 'Admin';

  @BeforeInsert()
  @BeforeUpdate()
  encryptPassword() {
    if (this.password) {
      this.encrypted_password = bcrypt.hashSync(this.password, 10);
      this.password = null;
    }
  }
}

export { RoleEnum };
