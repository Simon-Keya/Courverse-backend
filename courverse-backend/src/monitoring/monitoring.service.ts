import { Injectable } from '@nestjs/common';
import * as os from 'os';

@Injectable()
export class MonitoringService {
  getSystemMetrics() {
    return {
      uptime: os.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
    };
  }
}
