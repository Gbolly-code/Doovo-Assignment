// src/bookings/dto/create-booking.dto.ts
import { IsEnum } from 'class-validator';

export class CreateBookingDto {
  @IsEnum(['dropoff', 'pickup_return'], {
    message: 'type must be either dropoff or pickup_return',
  })
  type: 'dropoff' | 'pickup_return';
}
