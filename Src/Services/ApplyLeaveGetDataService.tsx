import RestApi from './RestApi';

/* ============================================================
   API JSON TYPES
============================================================ */

export interface LeaveBalanceJson {
  totalLeave: number;
  balanceLeave: number;
  restrictedLeave: number;
  quarterlyLeave: number;
}

export interface ApplyLeaveHolidayJson {
  date: string;
  name: string;
  restricted: boolean;
}

export interface ExistingLeaveJson {
  from_date: string;
  to_date: string;
}

export interface LeaveAuthorityJson {
  id: number;
  employee_id: number;
  name: string;
  designation: string;
}

export interface ApplyLeaveDataJson {
  leaveBalance: LeaveBalanceJson;
  holidays: ApplyLeaveHolidayJson[];
  authorities: LeaveAuthorityJson[];
  leave: ExistingLeaveJson[];
}

export interface ApplyLeaveResponseJson {
  success: boolean | string;
  message: string;
  data?: ApplyLeaveDataJson;
}

export interface SubmitLeaveRequestJson {
  success: boolean | string;
  message: string;
  data?: {
    id: number;
  };
}

/* ============================================================
   LEAVE BALANCE MODEL
============================================================ */

export class LeaveBalanceModel {
  totalLeave: number;
  balanceLeave: number;
  restrictedLeave: number;
  quarterlyLeave: number;

  constructor({
    totalLeave,
    balanceLeave,
    restrictedLeave,
    quarterlyLeave,
  }: {
    totalLeave: number;
    balanceLeave: number;
    restrictedLeave: number;
    quarterlyLeave: number;
  }) {
    this.totalLeave = totalLeave;
    this.balanceLeave = balanceLeave;
    this.restrictedLeave = restrictedLeave;
    this.quarterlyLeave = quarterlyLeave;
  }

  static fromJson(json: LeaveBalanceJson): LeaveBalanceModel {
    return new LeaveBalanceModel({
      totalLeave: Number(json.totalLeave),
      balanceLeave: Number(json.balanceLeave),
      restrictedLeave: Number(json.restrictedLeave),
      quarterlyLeave: Number(json.quarterlyLeave),
    });
  }
}

/* ============================================================
   HOLIDAY MODEL
============================================================ */

export class ApplyLeaveHolidayModel {
  date: string;
  name: string;
  restricted: boolean;

  constructor({
    date,
    name,
    restricted,
  }: {
    date: string;
    name: string;
    restricted: boolean;
  }) {
    this.date = date;
    this.name = name;
    this.restricted = restricted;
  }

  static fromJson(json: ApplyLeaveHolidayJson): ApplyLeaveHolidayModel {
    return new ApplyLeaveHolidayModel({
      date: json.date,
      name: json.name,
      restricted: Boolean(json.restricted),
    });
  }
}

/* ============================================================
   EXISTING LEAVE MODEL
============================================================ */

export class ExistingLeaveModel {
  from_date: string;
  to_date: string;

  constructor({ from_date, to_date }: { from_date: string; to_date: string }) {
    this.from_date = from_date;
    this.to_date = to_date;
  }

  static fromJson(json: ExistingLeaveJson): ExistingLeaveModel {
    return new ExistingLeaveModel({
      from_date: json.from_date,
      to_date: json.to_date,
    });
  }
}

/* ============================================================
   APPROVAL AUTHORITY MODEL
============================================================ */

export class LeaveAuthorityModel {
  id: number;
  employee_id: number;
  name: string;
  designation: string;

  constructor({
    id,
    name,
    designation,
    employee_id,
  }: {
    id: number;
    name: string;
    designation: string;
    employee_id: number;
  }) {
    this.id = id;
    this.employee_id = employee_id;
    this.name = name;
    this.designation = designation;
  }

  static fromJson(json: LeaveAuthorityJson): LeaveAuthorityModel {
    return new LeaveAuthorityModel({
      id: Number(json.id),
      employee_id: Number(json.employee_id),
      name: json.name,
      designation: json.designation,
    });
  }
}

/* ============================================================
   APPLY LEAVE DATA MODEL
============================================================ */

export class ApplyLeaveDataModel {
  leaveBalance: LeaveBalanceModel;
  holidays: ApplyLeaveHolidayModel[];
  authorities: LeaveAuthorityModel[];
  leave: ExistingLeaveModel[];

  constructor({
    leaveBalance,
    holidays,
    authorities,
    leave,
  }: {
    leaveBalance: LeaveBalanceModel;
    holidays: ApplyLeaveHolidayModel[];
    authorities: LeaveAuthorityModel[];
    leave: ExistingLeaveModel[];
  }) {
    this.leaveBalance = leaveBalance;
    this.holidays = holidays;
    this.authorities = authorities;
    this.leave = leave;
  }

  static fromJson(json: ApplyLeaveDataJson): ApplyLeaveDataModel {
    return new ApplyLeaveDataModel({
      leaveBalance: LeaveBalanceModel.fromJson(json.leaveBalance),

      holidays: (json.holidays ?? []).map(item =>
        ApplyLeaveHolidayModel.fromJson(item),
      ),

      authorities: (json.authorities ?? []).map(item =>
        LeaveAuthorityModel.fromJson(item),
      ),

      leave: (json.leave ?? []).map(item => ExistingLeaveModel.fromJson(item)),
    });
  }
}

/* ============================================================
   GET APPLY LEAVE META
============================================================ */

export const getApplyLeaveMeta = async (): Promise<ApplyLeaveDataModel> => {
  const json = await RestApi.get<ApplyLeaveResponseJson>(
    '/api/leaves/apply-meta',
  );

  if (!json) {
    throw new Error('Unable to load leave details');
  }

  if (!(json.success === true || json.success === 'true')) {
    throw new Error(json.message || 'Unable to load leave details');
  }

  if (!json.data) {
    throw new Error(json.message || 'Leave data not found');
  }

  return ApplyLeaveDataModel.fromJson(json.data);
};

export const submitLeaveRequest = async (
  payload: Record<string, any>,
): Promise<SubmitLeaveRequestJson> => {
  const json = await RestApi.post<SubmitLeaveRequestJson>(
    '/api/leaves/apply',
    payload,
  );

  if (!json) {
    throw new Error('Unable to submit leave request');
  }

  if (!(json.success === true || json.success === 'true')) {
    throw new Error(json.message || 'Unable to submit leave request');
  }

  return json;
};
