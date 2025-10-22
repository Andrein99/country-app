import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, catchError, throwError, delay, of, tap } from 'rxjs';

import type { RESTCountry } from '../interfaces/rest-countries.interfaces';
import type { Country } from '../interfaces/country.interface';
import type { Region } from '../interfaces/region.type';
import { CountryMapper } from '../mappers/country.mapper';

const API_URL = 'https://restcountries.com/v3.1';

@Injectable({
  providedIn: 'root'
})
export class CountryService {
  private http = inject(HttpClient);
  private queryCacheCapital = new Map<string,Country[]>();
  private queryCacheCountry = new Map<string,Country[]>();
  private queryCacheRegion = new Map<Region,Country[]>();

  searchByCapital(query: string): Observable<Country[]> {
    /*  Buscar países por capital utilizando la API REST Countries.
        Implementar un mecanismo de caché para evitar llamadas repetidas
        con el mismo query.
    */
    query = query.toLowerCase();

    if (this.queryCacheCapital.has(query)) {
      return of(this.queryCacheCapital.get(query) ?? []);
    }

    return this.http.get<RESTCountry[]>(`${API_URL}/capital/${query}`)
      .pipe(
        map((restCountries) =>
          CountryMapper.mapRestCountryArrayToCountryArray(restCountries)
        ),
        tap((countries) => this.queryCacheCapital.set(query, countries)),
        catchError((error) => {
          console.log(`Error fetching: ${error}`)

          return throwError(
            () => new Error(`No se pudo obtener países con el query: ${query}`)
          );
        })
      );
  }

  searchByCountry(query: string): Observable<Country[]> {
    /*  Buscar países por nombre utilizando la API REST Countries.
        Implementar un mecanismo de caché para evitar llamadas repetidas
        con el mismo query.
    */
    query = query.toLowerCase();

    if(this.queryCacheCountry.has(query)) {
      return of(this.queryCacheCountry.get(query) ?? []);
    }

    return this.http.get<RESTCountry[]>(`${API_URL}/name/${query}`)
      .pipe(
        map((restCountries) =>
          CountryMapper.mapRestCountryArrayToCountryArray(restCountries)
        ),
        tap((countries) => this.queryCacheCountry.set(query, countries)),
        // delay(3000), // Permite testear un tiempo para notar diferente información. Como la experiencia de usuario.
        catchError((error) => {
          return throwError(
            () => new Error(`No se pudo obtener países con el query: ${query}`)
          );
        })
      );
  }

  searchByRegion(region: Region) {
    /*  Buscar países por región utilizando la API REST Countries.
        Implementar un mecanismo de caché para evitar llamadas repetidas
        con la misma región.
    */
    const url = `${API_URL}/region/${region}`;

    if (this.queryCacheRegion.has(region)) {
      return of(this.queryCacheRegion.get(region) ?? []);
    }

    return this.http.get<RESTCountry[]>(url)
      .pipe(
        map((restCountries) =>
          CountryMapper.mapRestCountryArrayToCountryArray(restCountries)
        ),
        tap((countries) => this.queryCacheRegion.set(region, countries)),
        catchError((error) => {
          console.log(`Error fetching: ${error}`)

          return throwError(
            () => new Error(`No se pudo obtener países para la región: ${region}`)
          );
        })
      );
  }

  searchCountryByAlphaCode(code: string) {
    /*  Buscar un país por su código alfa utilizando la API REST Countries.
    */
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
