import { Module } from '@nestjs/common';
import { ExecCommand } from './exec.command';

@Module({
  providers: [ExecCommand],
})
export class ExecModule {}
