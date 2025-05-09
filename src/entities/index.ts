
export enum Role {
  User = 'user',
  Admin = 'admin',
}

export interface IUser {
  id: number;
  username: string
  password: string
  firstName: string
  lastName: string
  role: Role;
  address: string
  phoneNumber: string
  accounts: IAccount[]
}

export interface IAccount {
  id: number;

  accountType: 'checking' | 'savings';

  balance: number;

  user: IUser;

  transactions: ITransaction[];
}

  export enum TransactionType {
    DEBIT = 'DEBIT',
    CREDIT = 'CREDIT',
    DEPOSIT = 'DEPOSIT',
    WITHDRAW = 'WITHDRAW'
  }
export interface ITransaction {
  id: number
account: IAccount
type: TransactionType
amount: number
fromAccountId?: string
toAccountId?: string
createdAt: Date
}
