import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, ParseIntPipe } from '@nestjs/common';
import { LoanService } from './loan.service';
import { MakeRepaymentDto } from './dto/make-repayment.dto';
import { Repayment } from './entities/repayment.entity';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/role.guard';
import { Roles } from 'src/decorators/role.decorator';
import { Role } from 'src/entities';

@Controller('loans')
export class LoanController {
    constructor(private readonly loanService: LoanService) {}

    @UseGuards(AuthGuard('jwt'))
    @Post()
    create(@Body() createLoanDto: CreateLoanDto, @Request() req) {
        const userId = req.user.id;
        return this.loanService.create(createLoanDto, userId);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin) 
    @Get()
    findAll() {
        return this.loanService.findAll();
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.loanService.findOne(+id);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin)  
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateLoanDto: UpdateLoanDto) {
        return this.loanService.update(+id, updateLoanDto);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin)  
    @Patch(':id/approve')
    approveLoan(@Param('id') id: string) {
        return this.loanService.approveLoan(+id);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin) 
    @Patch(':id/reject')
    rejectLoan(@Param('id') id: string) {
        return this.loanService.rejectLoan(+id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post(':loanId/repayments')
    makeRepayment(@Param('loanId') loanId: string, @Body() { amount }: { amount: number }) {
        return this.loanService.makeRepayment(+loanId, amount);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':loanId/status')
    getLoanStatusAndHistory(@Param('loanId') loanId: string) {
        return this.loanService.getLoanStatusAndHistory(+loanId);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin) 
    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.loanService.remove(+id);
    }
}