// src/bookings/bookings.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

describe('BookingsController', () => {
  let controller: BookingsController;
  let service: BookingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [
        {
          provide: BookingsService,
          useValue: { create: jest.fn() }, // mock service
        },
      ],
    }).compile();

    controller = module.get<BookingsController>(BookingsController);
    service = module.get<BookingsService>(BookingsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a booking with userId', async () => {
    const dto = { type: 'dropoff' } as const;
    const mockResult = { id: 1, type: 'dropoff', userId: 'test-user', status: 'pending' };

    (service.create as jest.Mock).mockResolvedValue(mockResult);

    const req = { user: { sub: 'test-user' } };
    const result = await controller.create(dto, req);

    expect(service.create).toHaveBeenCalledWith(dto, 'test-user');
    expect(result).toEqual(mockResult);
  });
});