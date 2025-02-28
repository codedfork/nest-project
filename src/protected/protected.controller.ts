// src/protected/protected.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from  '../auth/jwt-auth.gaurd'

@Controller('protected')
export class ProtectedController {

  @Get()
  @UseGuards(JwtAuthGuard)  // Protect this route with the JwtAuthGuard
  getProtectedData() {
    return { message: 'This is protected data!' };
  }
}
