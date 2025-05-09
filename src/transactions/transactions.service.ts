import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { Account } from '../accounts/account.entity'; 
import { TransferDto, FilterTransactionsDto } from './dto/create-transaction.dto'; 
import { TransactionType } from 'src/entities';
import { DepositDto } from './dto/deposit.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
    
    @InjectRepository(Account)
    private accountRepo: Repository<Account>,
  ) {}

  async transferFunds(dto: TransferDto) {
    const { fromAccountId, toAccountId, amount } = dto;

    const from = await this.accountRepo.findOne({ where: { id: Number(fromAccountId) } });
    const to = await this.accountRepo.findOne({ where: { id: Number(toAccountId) } });


    if (!from || !to) throw new NotFoundException('Account not found');
    if (Number(from.balance) < amount) throw new BadRequestException('Insufficient funds');

    // Debit from source
    from.balance = Number(from.balance) - amount;

    // Credit to destination
    to.balance = Number(to.balance) + amount;

    // Save accounts
    await this.accountRepo.save([from, to]);

    // Log transactions (2 records)
    const debitTx = this.transactionRepo.create({
      account: from,
      type: TransactionType.DEBIT,
      amount,
      toAccountId,
    });
    
    const creditTx = this.transactionRepo.create({
      account: to,
      type: TransactionType.CREDIT,
      amount,
      fromAccountId,
    });

    await this.transactionRepo.save([debitTx, creditTx]);

    return { message: 'Transfer successful' };
  }

  async getTransactionHistory(accountId: string, filterDto: FilterTransactionsDto) {
    const { startDate, endDate, type } = filterDto;

    const query = this.transactionRepo
      .createQueryBuilder('transaction')
      .where('transaction.accountId = :accountId', { accountId });

    if (startDate) {
      query.andWhere('transaction.createdAt >= :startDate', { startDate });
    }
    if (endDate) {
      query.andWhere('transaction.createdAt <= :endDate', { endDate });
    }
    if (type) {
      query.andWhere('transaction.type = :type', { type });
    }

    return query.getMany();
  }

  async generateReport(accountId: string) {
    const transactions = await this.getTransactionHistory(accountId, {} as FilterTransactionsDto);

    const totalIn = transactions
      .filter(tx => tx.type === 'CREDIT', 'DEPOSIT')
      .reduce((acc, tx) => acc + Number(tx.amount), 0);

    const totalOut = transactions
      .filter(tx => tx.type === 'DEBIT', 'WITHDRAW')
      .reduce((acc, tx) => acc + Number(tx.amount), 0);

    return {
      totalIn,
      totalOut,
      net: totalIn - totalOut,
      transactions,
    };
  }

  async deposit(depositDto: DepositDto) {
    const { accountId, amount } = depositDto;

    const account = await this.accountRepo.findOne({ where: { id: accountId } });
    if (!account) {
      throw new Error('Account not found');
    }

    // Update account balance
    account.balance = Number(account.balance) + Number(amount);
    await this.accountRepo.save(account);

    // Log the transaction
    const transaction = this.transactionRepo.create({
      account,
      amount,
      type: TransactionType.DEPOSIT
    });

    return this.transactionRepo.save(transaction);
  }
  async getAllTransactions(user: any): Promise<Transaction[]> {
    if (user.role === 'admin') {
      return this.transactionRepo.find({
        order: { createdAt: 'DESC' },
        relations: ['account'],
      });
    }
  
    // Find all transactions where this user is involved (as account owner)
    const userAccounts = await this.accountRepo.find({
      where: { user: { id: user.userId } },
    });
  
    const accountIds = userAccounts.map(acc => acc.id);
    if (accountIds.length === 0) return [];
  
    return this.transactionRepo.find({
      where: accountIds.map(id => ({ account: { id } })),
      order: { createdAt: 'DESC' },
      relations: ['account'],
    });
  }
}
