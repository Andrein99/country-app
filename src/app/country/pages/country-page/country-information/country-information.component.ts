import { Component, computed, input } from '@angular/core';
import type { Country } from '../../../interfaces/country.interface';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'country-information-page',
  imports: [DecimalPipe],
  templateUrl: './country-information.component.html',
})
export class CountryInformationComponent {
  country = input.required<Country>();

  currentYear = computed(() => {
    return new Date().getFullYear();
  })
}
