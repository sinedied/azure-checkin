import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localDate',
})
export class LocalDatePipe implements PipeTransform {
  transform(value: string): string {
    return new Date(value).toLocaleDateString();
  }
}
