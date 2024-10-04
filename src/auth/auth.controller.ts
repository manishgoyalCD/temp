import { Controller, Get, Body } from '@nestjs/common';
import { UserService } from 'src/modules/user/services/user.service';

@Controller('auth')
export class AuthController {

constructor(private userervice:UserService){}

    @Get('/login')
    async validate(@Body() body:Body): Promise<any>{
        const user = body;
        console.log(user);
        return user;
    }
}
