import { Component, inject, resource, signal } from '@angular/core';
import { SearchInputComponent } from "../../components/search-input/search-input.component";
import { CountryListComponent } from "../../components/country-list/country-list.component";
import { CountryService } from '../../services/country.service';

import { firstValueFrom, of } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop'

@Component({
  selector: 'app-by-capital-page',
  imports: [SearchInputComponent, CountryListComponent],
  templateUrl: './by-capital-page.component.html',
})
export class ByCapitalPageComponent {
  countryService = inject(CountryService);

  query = signal('');

  countryResource = rxResource({
    params: () => ({ query: this.query() }),
    stream: ({ params }) => {
      if ( !params.query ) return of([]); // Se usa la función of para transformarlo en un observable.

      return this.countryService.searchByCapital(params.query);
    },
  });

  // countryResource = resource({
  //   params: () => ({ query: this.query() }),
  //   loader: async ({ params }) => {
  //     if ( !params.query ) return [];

  //     return await firstValueFrom(
  //       this.countryService.searchByCapital(params.query)
  //     ); // Convierte un observable en una promesa.
  //   },
  // });

  // isLoading = signal<boolean>(false);
  // isError = signal<string|null>(null);
  // countries = signal<Country[]>([]);

  // onSearch(query: string) {
  //   if (this.isLoading()) return;

  //   this.isLoading.set(true);
  //   this.isError.set(null);

  //   this.countryService.searchByCapital(query)
  //     .subscribe({
  //       next: (countries) => {
  //         this.isLoading.set(false);
  //         this.countries.set(countries);
  //       },
  //       error: (err) => {
  //         this.isLoading.set(false);
  //         this.countries.set([]);
  //         this.isError.set(err);
  //       }
  //     });
  // }
}
