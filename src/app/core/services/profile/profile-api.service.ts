import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http/http.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';

/**
 * Profile API Service
 * Handles all API calls for user profile operations
 */
@Injectable({
    providedIn: 'root'
})
export class ProfileApiService {
    private httpService = inject(HttpService);

    // ============================================
    // PROFILE OPERATIONS
    // ============================================

    /**
     * Get current user's profile
     */
    getProfile(): Observable<UserProfileResponse> {
        return this.httpService.get<UserProfileResponse>(API_ENDPOINTS.profile.base);
    }

    /**
     * Update user profile (personal info)
     * @param data Profile update data
     */
    updateProfile(data: UpdateProfileRequest): Observable<UserProfileResponse> {
        return this.httpService.put<UserProfileResponse>(
            API_ENDPOINTS.profile.base,
            data
        );
    }

    // ============================================
    // ADDRESS OPERATIONS
    // ============================================

    /**
     * Get all user addresses
     */
    getAddresses(): Observable<AddressResponse[]> {
        return this.httpService.get<AddressResponse[]>(API_ENDPOINTS.profile.addresses);
    }

    /**
     * Save address (create new or update existing)
     * @param address Address data
     */
    saveAddress(address: SaveAddressRequest): Observable<AddressResponse> {
        return this.httpService.post<AddressResponse>(
            API_ENDPOINTS.profile.addresses,
            address
        );
    }

    /**
     * Delete address
     * @param addressId Address ID to delete
     */
    deleteAddress(addressId: number): Observable<void> {
        return this.httpService.delete<void>(
            API_ENDPOINTS.profile.addressById(addressId)
        );
    }
}

// ============================================
// INTERFACES
// ============================================

export interface UserProfileResponse {
    userId: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
}

export interface UpdateProfileRequest {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
}

export interface AddressResponse {
    addressId: number;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
}

export interface SaveAddressRequest {
    addressId?: number; // null for new address, set for update
    street: string;
    city: string;
    postalCode: string;
    country: string;
    setAsDefault: boolean;
}
