import { IsEnum } from 'class-validator';

export class UpdateBookingStatusDto {
  @IsEnum(['accepted', 'on_the_way', 'washing', 'complete'], {
    message: 'Status must be one of: accepted | on_the_way | washing | complete',
  })
  status: 'accepted' | 'on_the_way' | 'washing' | 'complete';
}
