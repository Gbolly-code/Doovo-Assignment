// src/bookings/bookings.controller.ts
import {
  Body,
  Controller,
  Get,
  Patch,
  Param,
  UseGuards,
  NotFoundException,
  Post,
  BadRequestException,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking-status.dto';

@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create(createBookingDto);
  }

  @Get()
  findAll() {
    return this.bookingsService.findAll();
  }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('washer')
  updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateBookingStatusDto,
  ) {
    try {
      const updated = this.bookingsService.updateStatus(
        +id,
        updateStatusDto.status,
      );
      if (!updated) throw new NotFoundException('Booking not found');
      return updated;
    } catch (err) {
      throw new BadRequestException(err.message);
    }
  }
}
