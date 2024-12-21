import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dto/reports.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private reportsRepository: Repository<Report>,
    @InjectRepository(User) private usersRepository: Repository<User>
  ) { }

  async create(reportsData: CreateReportDto) {
    const { reporting, reported, description } = reportsData;

    const reportingUser = await this.usersRepository.findOne({ where: { id: reporting } });
    if (!reportingUser) throw new NotFoundException('Reporting user not found.');

    const reportedUser = await this.usersRepository.findOne({ where: { id: reported } });
    if (!reportedUser) throw new NotFoundException('Reported user not found.');

    if (reported === reporting) throw new BadRequestException('You cannot report yourself.');

    const report = this.reportsRepository.create({
      description: description,
      reporting_user: { id: reporting },
      reported_user: { id: reported },
    });
    return this.reportsRepository.save(report);
  }

  async findAll() {
    const reports = await this.reportsRepository.find({ relations: ['reported_user', 'reporting_user'] });

    const resReports = reports.map(report => ({
      ...report,
      reporting_user: {
        id: report.reporting_user.id,
        fullname: report.reporting_user.fullname,
        username: report.reporting_user.username
      },
      reported_user: {
        id: report.reported_user.id,
        fullname: report.reported_user.fullname,
        username: report.reported_user.username
      }
    }))

    return resReports;
  }

  async findOne(id: string) {
    const reportFound = await this.reportsRepository.findOne({ where: { report_id: id }, relations: ['reported_user', 'reporting_user'] });
    if (!reportFound) throw new NotFoundException('Report not found.');

    const resReport = {
      ...reportFound,
      reporting_user: {
        id: reportFound.reporting_user.id,
        fullname: reportFound.reporting_user.fullname,
        username: reportFound.reporting_user.username
      },
      reported_user: {
        id: reportFound.reported_user.id,
        fullname: reportFound.reported_user.fullname,
        username: reportFound.reported_user.username
      }
    };

    return resReport;
  }

  async remove(id: string) {
    const reportFound = await this.reportsRepository.findOne({ where: { report_id: id } });
    if (!reportFound) throw new NotFoundException('Report not found.');

    await this.reportsRepository.delete({ report_id: id });

    return "Report deleted successfully.";
  }
}
