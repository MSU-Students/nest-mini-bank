import { Controller, Get, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Roles } from 'src/decorators/role.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Role } from 'src/entities';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountsService.create(createAccountDto);
  }

  @Get()
  findAll() {
    return this.accountsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.accountsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateAccountDto: UpdateAccountDto) {
    return this.accountsService.update(id, updateAccountDto);
  }

  @ApiBearerAuth()
  @Roles(Role.User)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.accountsService.remove(id);
  }
}
