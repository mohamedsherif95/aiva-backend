enum Roles {
  DEVELOPER = 'developer',
  ADMIN = 'admin',
  ACCOUNTANT = 'accountant',
  SUPERVISOR = 'supervisor',
}

enum RolesIDs {
  ADMIN = 1,
  ACCOUNTANT = 2,
  SUPERVISOR = 3,
  DEVELOPER = 4,
}

enum AssignableRoles {
  ADMIN = 'admin',
  ACCOUNTANT = 'accountant',
  SUPERVISOR = 'supervisor',
}

enum AssignableRolesIDs {
  ADMIN = 1,
  ACCOUNTANT = 2,
  SUPERVISOR = 3,
}

const adminstrativeRolesIds = [RolesIDs.ADMIN, RolesIDs.ACCOUNTANT, RolesIDs.DEVELOPER];

const PostgresErrorCodes = {
  uniqueConstraint: {
    code: '23505',
    message: 'Duplicate entry',
  },
  foreignKey: {
    code: '23503',
    message: 'Invalid reference to another entity',
  },
  notNull: {
    code: '23502',
    message: 'A required field is missing',
  },
  stringLengthLimit: {
    code: '22001',
    message: 'Input value is too long',
  },
};

const defaultAllowedOrigins = [
  'http://localhost:3000',
  'http://localhost:4173',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'https://etihad-bus.vercel.app',
  'https://etihad-bus-iota.vercel.app',
];

// fare, fuelDaily, fuelLargeOne, fuelLargeTwo, maintenance, oil, tollCharges, debt
enum TripExpenseType {
  FARE = 'fare',
  FUEL_DAILY = 'fuelDaily',
  FUEL_LARGE_ONE = 'fuelLargeOne',
  FUEL_LARGE_TWO = 'fuelLargeTwo',
  MAINTENANCE = 'maintenance',
  OIL = 'oil',
  TOLL_CHARGES = 'tollCharges',
  DEBT = 'debt',
}

enum TripType {
  UNIVERSITY = 'university',
  REGULAR = 'regular',
  MIXED = 'mixed',
}

enum BusTypes {
  SUPER = 'super',
  MINI = 'mini',
}

type BusType = 'super' | 'mini';

interface FareCount {
  fare: number;
  count: number;
}

interface UniversityReportBreakdown {
  university: {
    id: number;
    name: string;
  };
  regularTrips: Record<BusType, FareCount>;
  extraTrips: Record<BusType, FareCount>;
  waitingTrips: Record<BusType, FareCount>;
  totalSuperFare: number;
  totalMiniFare: number;
}

interface UniversityReport {
  breakdown: UniversityReportBreakdown[];
  totalSuperFare: number;
  totalMiniFare: number;
}

enum CronJobStatus {
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
}

type MainTripType = {
  id?: number;
  userId: number;
  busId: number;
  driverId: number;
  tripDate: string;
  tripType: TripType;
  departureTime?: number;
  arrivalTime?: number;
  fromLocation: string;
  toLocation: string;
  fuelPriceSnapshot?: number;
  busDebt?: number;
  driverDebt?: number;
  notes?: string;
};

type regualarTripDetailsType = {
  tripId?: number;
  clientId: number;
  totalAmount?: number;
  depositAmount?: number;
  remainingAmount?: number;
  serialNumber?: string;
  destination?: string;
};

type universityTripDetailsType = {
  tripId?: number;
  waitingTrips?: number;
  extraTrips?: number;
  extraTripsTimings?: number[];
  returnLocation?: string;
  universityId: number;
  clientId: number;
};

type FullTripData = {
  mainTripData: MainTripType;
  regularTripDetailsData?: regualarTripDetailsType;
  universityTripDetailsData?: universityTripDetailsType;
};

enum GlobalConfigurationsNames {
  fuelPrice = 'fuelPrice',
  attendanceDays = 'attendanceDays',
  tripSerialPointer = 'tripSerialPointer',
}

export {
  Roles,
  RolesIDs,
  AssignableRoles,
  AssignableRolesIDs,
  PostgresErrorCodes,
  defaultAllowedOrigins,
  TripExpenseType,
  BusTypes,
  BusType,
  UniversityReportBreakdown,
  UniversityReport,
  TripType,
  CronJobStatus,
  FullTripData,
  MainTripType,
  regualarTripDetailsType,
  universityTripDetailsType,
  GlobalConfigurationsNames,
  adminstrativeRolesIds,
};
