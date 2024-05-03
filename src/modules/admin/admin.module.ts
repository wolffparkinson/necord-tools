import { Module } from '@nestjs/common';
import { EvalCommand, EvalService } from './eval';
import { ExecCommand } from './exec';

@Module({ providers: [EvalCommand, EvalService, ExecCommand] })
export class AdminModule {}
