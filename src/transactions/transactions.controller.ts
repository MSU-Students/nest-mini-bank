import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import {
  TransferDto,
  FilterTransactionsDto,
} from './dto/create-transaction.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/entities';
import { DepositDto } from './dto/deposit.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}

  @ApiBearerAuth()
  @Roles(Role.User)
  @Post('transfer')
  transfer(@Body() transferDto: TransferDto) {
    return this.service.transferFunds(transferDto);
  }

  @ApiBearerAuth()
  @Roles(Role.User)
  @Get(':accountId/history')
  getHistory(
    @Param('accountId') accountId: string,
    @Query() filterDto: FilterTransactionsDto,
  ) {
    return this.service.getTransactionHistory(accountId, filterDto);
  }

  @ApiBearerAuth()
  @Roles(Role.User)
  @Get(':accountId/report')
  getReport(@Param('accountId') accountId: string) {
    return this.service.generateReport(accountId);
  }

  @ApiBearerAuth()
  @Roles(Role.User)
  @Post('deposit')
  deposit(@Body() depositDto: DepositDto) {
    return this.service.deposit(depositDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.User, Role.Admin)
  @Get()
  getAll(@Request() req) {
    return this.service.getAllTransactions(req.user);
  }
}
