import { Component, inject, linkedSignal, signal } from '@angular/core';
import { of } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { CountryListComponent } from "../../components/country-list/country-list.component";
import { CountryService } from '../../services/country.service';
import type { Region } from '../../interfaces/region.type';

function validateQueryParam(queryParam: string): Region {
  /*  Validar que el queryParam sea uno de los valores permitidos.
      Si no es válido, retornar 'Americas' por defecto.
  */

  queryParam = queryParam.toLowerCase();

  const validRegions: Record<string, Region> = {
    'africa': 'Africa',
    'americas': 'Americas',
    'asia': 'Asia',
    'europe': 'Europe',
    'oceania': 'Oceania',
    'antarctic': 'Antarctic',
  }

  return validRegions[queryParam] ?? 'Americas';
}


@Component({
  selector: 'app-by-region-page',
  imports: [CountryListComponent],
  templateUrl: './by-region-page.component.html',
})
export class ByRegionPageComponent {
  /*  Aquí se debe implementar la lógica para obtener los países por región
      utilizando el CountryService y mostrando los resultados en el template.
  */
  countryService = inject(CountryService)

  public regions: Region[] = [
    'Africa',
    'Americas',
    'Asia',
    'Europe',
    'Oceania',
    'Antarctic',
  ];

  activatedRoute = inject(ActivatedRoute); // Para obtener los query params.
  router = inject(Router); // Para navegar y actualizar los query params.

  queryParam = this.activatedRoute.snapshot.queryParamMap.get('region') ?? ''; // Obtener el query param 'region'.

  selectedRegion = linkedSignal<Region|null>(() => validateQueryParam(this.queryParam)); // Señal que contiene la región seleccionada.

  selectRegion(region: Region) {
    this.selectedRegion.set(region);
  } // Método para actualizar la región seleccionada.

  countryResource = rxResource({ // Recurso reactivo para obtener los países por región.
    params: () => ({ region: this.selectedRegion() }),
    stream: ({ params }) => {
      if (!params.region) return of([]); // Si no hay región, retornar un observable de arreglo vacío.

      this.router.navigate(['/country/by-region'], {
        queryParams: {
          region: params.region
        }
      }); // Actualizar el query param en la URL.

      return this.countryService.searchByRegion(params.region);
    }
  });
}
