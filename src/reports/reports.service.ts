import { Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/reports.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private reportsRepository: Repository<Report>
  ) { }

  create(reportsData: CreateReportDto) {
    const report = this.reportsRepository.create(reportsData);
    return this.reportsRepository.save(report);
  }

  findAll() {
    return `This action returns all reports`;
  }

  findOne(id: number) {
    return `This action returns a #${id} report`;
  }

  update(id: number) {
    return `This action updates a #${id} report`;
  }

  remove(id: number) {
    return `This action removes a #${id} report`;
  }
}
