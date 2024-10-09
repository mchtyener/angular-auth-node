import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { API_CONFIG, EndpointsConfig } from '../config/endpoints-config';

@Injectable({
  providedIn: 'root'
})
export class EndpointService {
  private endpoints: EndpointsConfig = API_CONFIG.ENDPOINTS;
  private baseUrl = environment.apiUrl

  constructor() { }
  buildUrl(
    endpointKey: keyof EndpointsConfig,
    params?: { [key: string]: string }
  ): string {
    let endpointTemplate = this.endpoints[endpointKey];

    if (typeof endpointTemplate !== 'string') {
      throw new Error(`Endpoint ${String(endpointKey)} is not a string`);
    }

    let endpointString: string = endpointTemplate;

    if (params) {
      for (const key in params) {
        if (params.hasOwnProperty(key)) {
          const value = encodeURIComponent(params[key]);
          endpointString = endpointString.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), value);
        }
      }
    }

    return `${this.baseUrl}/${endpointString}`;
  }
}
