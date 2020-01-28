import { Repository, EntityRepository } from "typeorm";
import { ConflictException, InternalServerErrorException } from "../../node_modules/@nestjs/common";
import * as bcrypt from 'bcrypt';
import { User } from "./user.entity";
import { AuthCredentialsDto } from "./dto/auth-credentials.dto";

@EntityRepository(User)
export class UserRepository extends Repository<User>{
    
    async signUp(authCredentialsDto: AuthCredentialsDto) : Promise<void>{
        const {username , password} = authCredentialsDto;
    
        const salt =await bcrypt.genSalt();
        const user = new User();
        user.username = username;
        user.password = password;
        user.salt = salt;
        user.password =await this.hashPassword(password , salt);

        try{
        await user.save();
    }
    catch(error){
        if(error.code === '23505'){  //Duplicate username
            throw new ConflictException("UserName Already Exists");
        }
            throw new InternalServerErrorException();
    } 

    }
    
    async validateUserPassword(authCredentialsDto : AuthCredentialsDto): Promise<string> {
        const {username , password }= authCredentialsDto;
        const user =await this.findOne({username});
        if(user && await user.validatePassword(password)){
            return user.username;
        }else{
            return null;
        }

    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
      }
}