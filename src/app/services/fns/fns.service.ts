import { httpClient } from '@/app/interceptors/http.interceptor';

export interface INNValidationResponse {
  inn: string;
  valid: boolean;
  type?: 'legal' | 'individual';
  typeDescription?: string;
  error?: string;
}

export interface CompanyLookupResponse {
  found: boolean;
  inn?: string;
  kpp?: string;
  ogrn?: string;
  name?: string;
  fullName?: string;
  shortName?: string;
  type?: 'legal' | 'individual';
  status?: string;
  address?: string;
  director?: string;
  directorPosition?: string;
  registrationDate?: string;
  error?: string;
  requiresApiKey?: boolean;
  apiKeyConfigHint?: string;
}

export const fnsService = {
  /**
   * Validate INN (Taxpayer Identification Number)
   */
  validateINN: async (inn: string): Promise<INNValidationResponse> => {
    const response = await httpClient.post<INNValidationResponse>('/fns/validate-inn', { inn });
    return response.data;
  },

  /**
   * Lookup company by INN
   */
  lookupCompany: async (inn: string): Promise<CompanyLookupResponse> => {
    const response = await httpClient.post<CompanyLookupResponse>('/fns/lookup-company', { inn });
    return response.data;
  },
};
