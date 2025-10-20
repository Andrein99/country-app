import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, catchError, throwError, delay } from 'rxjs';

import type { RESTCountry } from '../interfaces/rest-countries.interfaces';
import type { Country } from '../interfaces/country.interface';
import { CountryMapper } from '../mappers/country.mapper';

const API_URL = 'https://restcountries.com/v3.1';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private http = inject(HttpClient);

  searchByCapital(query: string): Observable<Country[]> {
    query = query.toLowerCase();

    return this.http.get<RESTCountry[]>(`${API_URL}/capital/${query}`)
      .pipe(
        map((restCountries) =>
          CountryMapper.mapRestCountryArrayToCountryArray(restCountries)
        ),
        catchError((error) => {
          return throwError(
            () => new Error(`No se pudo obtener países con el query: ${query}`)
          );
        })
      );
  }

  searchByCountry(query: string): Observable<Country[]> {
    query = query.toLowerCase();

    return this.http.get<RESTCountry[]>(`${API_URL}/name/${query}`)
      .pipe(
        map((restCountries) =>
          CountryMapper.mapRestCountryArrayToCountryArray(restCountries)
        ),
        // delay(3000), // Permite testear un tiempo para notar diferente información. Como la experiencia de usuario.
        catchError((error) => {
          return throwError(
            () => new Error(`No se pudo obtener países con el query: ${query}`)
          );
        })
      );
  }

  searchCountryByAlphaCode(code: string) {
    const url = `${API_URL}/alpha/${code}`;

    return this.http.get<RESTCountry[]>(url)
      .pipe(
        map((restCountries) =>
          CountryMapper.mapRestCountryArrayToCountryArray(restCountries)
        ),
        map((countries) => countries.at(0)),
        // delay(3000), // Permite testear un tiempo para notar diferente información. Como la experiencia de usuario.
        catchError((error) => {
          return throwError(
            () => new Error(`No se pudo obtener países con el código: ${code}`)
          );
        })
      );
  }
}
