import { IsString, MinLength, MaxLength, Matches } from "../../../node_modules/class-validator";

export class AuthCredentialsDto {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;

    @IsString()
    @MinLength(4)
    @MaxLength(20)
    password: string;
} 