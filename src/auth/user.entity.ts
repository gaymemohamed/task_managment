import { BaseEntity, PrimaryGeneratedColumn, Column, Entity, Unique, OneToMany } from "../../node_modules/typeorm";
import * as bcrypt from 'bcrypt';
import { Task } from "../tasks/task.entity";

@Entity()
@Unique(['username'])
export class User extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username : string

    @Column()
    password : string 

    @Column()
    salt : string

    async validatePassword(password : string):Promise<boolean>{
        const hash = await bcrypt.hash(password , this.salt);
        return hash === this.password;
    }

    @OneToMany(type => Task , task=> task.user, {eager : true})
    tasks : Task[];
}