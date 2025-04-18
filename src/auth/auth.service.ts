
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService, 
    private jwtService: JwtService) {}

  async signIn(username: string, pass: string): Promise<{access_token: string}> {
    const user = await this.usersService.findByUsername(username);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }
    
    const payload = { sub: user.id, username: user.username, role: user.role };
    // TODO: Generate a JWT and return it here
    // instead of the user object
    const result = {
        access_token: await this.jwtService.signAsync(payload)
    };
    return result;
  }
}
