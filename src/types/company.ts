/**
 * Company Profile Types
 * Stores company details and logo for RAMS document branding
 */

export interface CompanyProfile {
  id: string;
  userId: string;

  // Company Details
  companyName: string;
  tradingName?: string;
  registrationNumber?: string; // Companies House number
  vatNumber?: string;

  // Logo
  logoUrl?: string;
  logoBase64?: string; // For offline/export use

  // Contact Details
  address: {
    line1: string;
    line2?: string;
    city: string;
    county?: string;
    postcode: string;
  };
  phone: string;
  email: string;
  website?: string;

  // Accreditations (for display on RAMS)
  accreditations?: Accreditation[];

  // Insurance Details (optional for RAMS)
  insurance?: {
    publicLiability?: string;
    employersLiability?: string;
    professionalIndemnity?: string;
  };

  // Competent Person Details
  competentPerson?: {
    name: string;
    qualifications: string[];
    ecsCardNumber?: string;
  };

  createdAt: string;
  updatedAt: string;
}

export interface Accreditation {
  id: string;
  name: string; // e.g., "NICEIC", "NAPIT", "ECA"
  membershipNumber?: string;
  expiryDate?: string;
  logoUrl?: string;
}

/**
 * For guest users / one-time use
 * Minimal company info that can be added to a single RAMS
 */
export interface GuestCompanyInfo {
  companyName: string;
  logoBase64?: string;
  address?: {
    line1: string;
    city: string;
    postcode: string;
  };
  phone?: string;
  email?: string;
}

/**
 * Create empty company profile
 */
export function createEmptyCompanyProfile(userId: string): Omit<CompanyProfile, "id" | "createdAt" | "updatedAt"> {
  return {
    userId,
    companyName: "",
    address: {
      line1: "",
      city: "",
      postcode: "",
    },
    phone: "",
    email: "",
  };
}
