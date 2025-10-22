import { Component, inject, linkedSignal, resource, signal } from '@angular/core';
import { SearchInputComponent } from "../../components/search-input/search-input.component";
import { CountryListComponent } from "../../components/country-list/country-list.component";
import { CountryService } from '../../services/country.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-by-country-page',
  imports: [SearchInputComponent, CountryListComponent],
  templateUrl: './by-country-page.component.html',
})
export class ByCountryPageComponent {
  /*  Aquí se implementa la lógica para obtener los países por nombre
      utilizando el CountryService y mostrando los resultados en el template.
  */
  countryService = inject(CountryService);

  activatedRoute = inject(ActivatedRoute); // Para obtener los query params.
  router = inject(Router); // Para navegar y actualizar los query params.

  queryParam = this.activatedRoute.snapshot.queryParamMap.get('query') ?? ''; // Obtener el query param 'query'.

  query = linkedSignal(() => this.queryParam); // Señal que contiene el término de búsqueda.

  countryResource = rxResource({
    params: () => ({ query: this.query() }),
    stream: ({ params }) => {
      if (!params.query) return of([]);

      this.router.navigate(['/country/by-country'], {
        queryParams: {
          query: params.query
        }
      })

      return this.countryService.searchByCountry(params.query);
    }
  });

}
// countryResource = resource({
//   params: () => ({ query: this.query() }),
//   loader: async ({ params }) => {
//     if (!params.query) return [];

//     return await firstValueFrom(
//       this.countryService.searchByCountry(params.query)
//     );
//   },
// });
