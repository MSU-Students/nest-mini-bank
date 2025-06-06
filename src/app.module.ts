import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { Account } from './accounts/account.entity';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/guards/role.guard';
import { AuthModule } from './auth/auth.module';
import { AccountsModule } from './accounts/account.module'; 
import { WithdrawalsModule } from './withdrawals/withdrawals.module';
import { Withdrawal } from './withdrawals/withdrawal.entity';
import { BalanceInquiryModule } from './balance-inquiry/balance-inquiry.module';
import { BalanceInquiry } from './balance-inquiry/balance-inquiry.entity';
import { Transaction } from './transactions/entities/transaction.entity';
import { TransactionsModule } from './transactions/transactions.module';
import { Loan } from './loan/entities/loan.entity';
import { Repayment } from './loan/entities/repayment.entity';
import { LoanModule } from './loan/loan.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'dev.env',
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get<string>('database.host') || 'localhost',
          port: configService.get<number>('database.port') || 3306,
          username: configService.get('database.username') ||'root',
          password: configService.get('database.pass') ||'root',
          database: 'MiniBankingDB',
          entities: [User, Account, Withdrawal, BalanceInquiry, Transaction, Loan, Repayment], 
          synchronize: false, 
        }
      },
      inject: [ConfigService]
    }),
    UsersModule,
    AuthModule,
    AccountsModule,
    WithdrawalsModule,
    BalanceInquiryModule,
    TransactionsModule,
    LoanModule,
    TransactionsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}