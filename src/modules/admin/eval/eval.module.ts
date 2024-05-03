import { Module } from '@nestjs/common';
import { EvalCommand } from './eval.command';
import { EvalService } from './eval.service';

@Module({
  imports: [],
  providers: [EvalCommand, EvalService],
})
export class EvalModule {}
