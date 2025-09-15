// src/bookings/bookings.service.ts
import { Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';

export interface Booking {
  id: number;
  type: 'dropoff' | 'pickup_return';
  status: 'pending' | 'accepted' | 'on_the_way' | 'washing' | 'complete';
  userId: string;
}

@Injectable()
export class BookingsService {
  private bookings: Booking[] = [];
  private idCounter = 1;

  // now takes both dto and userId
  create(createBookingDto: CreateBookingDto, userId: string) {
    const booking: Booking = {
      id: this.idCounter++,
      type: createBookingDto.type,
      status: 'pending', // default when created
      userId,
    };
    this.bookings.push(booking);
    return booking;
  }

  findAll() {
    return this.bookings;
  }

  updateStatus(id: number, status: Booking['status']) {
    const booking = this.bookings.find((b) => b.id === id);
    if (!booking) return null;

    // allowed transitions
    const nextStatusMap: Record<Booking['status'], Booking['status'] | null> = {
      pending: 'accepted',
      accepted: 'on_the_way',
      on_the_way: 'washing',
      washing: 'complete',
      complete: null,
    };

    const allowedNext = nextStatusMap[booking.status];
    if (status !== allowedNext) {
      throw new Error(
        `Invalid status transition from ${booking.status} → ${status}`,
      );
    }

    booking.status = status;
    return booking;
  }
}