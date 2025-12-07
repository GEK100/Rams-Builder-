export interface Address {
  line1: string;
  line2?: string;
  city: string;
  county?: string;
  postcode: string;
  country?: string;
}

export interface ContactDetails {
  name: string;
  email: string;
  phone: string;
  mobile?: string;
}

export interface Contractor {
  id: string;
  companyName: string;
  tradeName: string;
  address: Address;
  contact: ContactDetails;
  registrationNumber?: string;
  insuranceDetails?: string;
}

export interface CDMInfo {
  // Client
  client: {
    name: string;
    company: string;
    address: Address;
    contact: ContactDetails;
  };

  // Principal Designer
  principalDesigner: {
    name: string;
    company: string;
    address: Address;
    contact: ContactDetails;
    registrationNumber?: string;
  };

  // Principal Contractor
  principalContractor: {
    name: string;
    company: string;
    address: Address;
    contact: ContactDetails;
    registrationNumber?: string;
  };

  // Contractors List
  contractors: Contractor[];

  // Project Information
  project: {
    title: string;
    description: string;
    reference: string;
    siteAddress: Address;
    startDate: string;
    endDate?: string;
    durationWeeks?: number;
  };

  // Notification (F10)
  notification: {
    isNotifiable: boolean;
    f10Reference?: string;
    f10SubmissionDate?: string;
    notificationNumber?: string;
    hseOffice?: string;
  };

  // Pre-construction Information
  preconstructionInfo: {
    existingDrawings: boolean;
    asbestosRegister: boolean;
    asbestosDetails?: string;
    groundConditions: boolean;
    groundConditionsDetails?: string;
    utilities: boolean;
    utilitiesDetails?: string;
    buildingServices: boolean;
    buildingServicesDetails?: string;
    previousUse?: string;
    knownHazards?: string;
    otherInfo?: string;
  };

  // H&S File Information
  hsFile: {
    location: string;
    custodian: string;
    format: "digital" | "physical" | "both";
    reviewDate?: string;
  };
}

export const emptyCDMInfo: CDMInfo = {
  client: {
    name: "",
    company: "",
    address: { line1: "", city: "", postcode: "" },
    contact: { name: "", email: "", phone: "" },
  },
  principalDesigner: {
    name: "",
    company: "",
    address: { line1: "", city: "", postcode: "" },
    contact: { name: "", email: "", phone: "" },
  },
  principalContractor: {
    name: "",
    company: "",
    address: { line1: "", city: "", postcode: "" },
    contact: { name: "", email: "", phone: "" },
  },
  contractors: [],
  project: {
    title: "",
    description: "",
    reference: "",
    siteAddress: { line1: "", city: "", postcode: "" },
    startDate: "",
  },
  notification: {
    isNotifiable: false,
  },
  preconstructionInfo: {
    existingDrawings: false,
    asbestosRegister: false,
    groundConditions: false,
    utilities: false,
    buildingServices: false,
  },
  hsFile: {
    location: "",
    custodian: "",
    format: "digital",
  },
};
