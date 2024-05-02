export interface User {
    accountNonLocked: boolean;
    email: string;
    profilePath: string;
    id: any;
    fullName: string;
    userType : string;
    isExternal: boolean;
    remainingAmount: number;
  }