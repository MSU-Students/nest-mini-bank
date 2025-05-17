import { IsNumber, Min } from 'class-validator';

export class MakeRepaymentDto {
  @IsNumber()
  @Min(1, { message: 'Repayment amount must be greater than 0' })
  amount: number;
  @IsNumber()
  loanId: number;
}