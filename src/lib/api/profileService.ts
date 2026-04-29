import { httpClient } from '@/lib/utils/httpClient';

// Types
export interface Address {
  division?: string;
  district?: string;
  city?: string;
  streetAddress?: string;
  postalCode?: string;
  phone?: string;
}

export interface ProfileStatus {
  isProfileComplete: boolean;
  address?: Address;
  missingFields: string[];
}

export interface PersonalDetailsData {
  name?: string;
  email?: string;
  phone?: string;
}

export interface AddressData {
  division?: string;
  district?: string;
  city?: string;
  streetAddress?: string;
  postalCode?: string;
  phone?: string;
}

export interface PasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface InterestsData {
  interestedTopics: string[];
}

export interface CompleteProfileData {
  division: string;
  district: string;
  city: string;
  streetAddress?: string;
  postalCode?: string;
  phone?: string;
}

// Response types
export interface ProfileStatusResponse {
  success: boolean;
  data: ProfileStatus;
}

export interface PersonalDetailsResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
  };
}

export interface AddressResponse {
  success: boolean;
  message: string;
  data: {
    address: Address;
    isProfileComplete: boolean;
  };
}

export interface MessageResponse {
  success: boolean;
  message: string;
}

export const profileService = {
  // Get profile status
  async getProfileStatus(): Promise<ProfileStatusResponse> {
    return httpClient.get<ProfileStatusResponse>('/profile/status');
  },

  // Update personal details (name, email, phone)
  async updatePersonalDetails(data: PersonalDetailsData): Promise<PersonalDetailsResponse> {
    return httpClient.patch<PersonalDetailsResponse>('/profile/personal', data);
  },

  // Update address
  async updateAddress(data: AddressData): Promise<AddressResponse> {
    return httpClient.patch<AddressResponse>('/profile/address', data);
  },

  // Update password
  async updatePassword(data: PasswordData): Promise<MessageResponse> {
    return httpClient.patch<MessageResponse>('/profile/password', data);
  },

  // Update interests
  async updateInterests(data: InterestsData): Promise<{ success: boolean; message: string; data: { interestedTopics: string[] } }> {
    return httpClient.patch('/profile/interests', data);
  },

  // Complete profile (all required fields at once)
  async completeProfile(data: CompleteProfileData): Promise<{ success: boolean; message: string; data: { id: string; name: string; email: string; role: string; address: Address; isProfileComplete: boolean } }> {
    return httpClient.post('/profile/complete', data);
  },
};
