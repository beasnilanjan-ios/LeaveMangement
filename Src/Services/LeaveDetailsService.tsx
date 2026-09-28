import RestApi from './RestApi';

export interface ApprovalJson {
  id: number;
  name: string;
  designation: string;
  status: string;
  date: string;
}

export interface LeaveJson {
  id: number;
  leaveType: string;
  applicationType: string;
  status: string;
  fromDate: string;
  toDate: string;
  appliedOn: string;
  totalDays: number;
  reason: string;
  rejectionReason: string | null;
  approvals: ApprovalJson[];
}

interface LeaveDetailsDataJson {
  leave: LeaveJson;
  earned_leave: string;
}

export interface LeaveDetailsResponseJson {
  success: boolean | string;
  message: string;
  data?: LeaveDetailsDataJson;
}

/* -------------------------------------------------------------------------- */
/* Approval Model                                                             */
/* -------------------------------------------------------------------------- */

export class ApprovalModel {
  id: number;
  name: string;
  designation: string;
  status: string;
  date: string;

  constructor({
    id,
    name,
    designation,
    status,
    date,
  }: {
    id: number;
    name: string;
    designation: string;
    status: string;
    date: string;
  }) {
    this.id = id;
    this.name = name;
    this.designation = designation;
    this.status = status;
    this.date = date;
  }

  static fromJson(json: ApprovalJson): ApprovalModel {
    return new ApprovalModel({
      id: json.id,
      name: json.name,
      designation: json.designation,
      status: json.status,
      date: json.date,
    });
  }
}

/* -------------------------------------------------------------------------- */
/* Leave Model                                                                */
/* -------------------------------------------------------------------------- */

export class LeaveModel {
  id: number;
  leaveType: string;
  applicationType: string;
  status: string;
  fromDate: string;
  toDate: string;
  appliedOn: string;
  totalDays: number;
  reason: string;
  rejectionReason: string | null;
  approvals: ApprovalModel[];

  constructor({
    id,
    leaveType,
    applicationType,
    status,
    fromDate,
    toDate,
    appliedOn,
    totalDays,
    reason,
    rejectionReason,
    approvals,
  }: {
    id: number;
    leaveType: string;
    applicationType: string;
    status: string;
    fromDate: string;
    toDate: string;
    appliedOn: string;
    totalDays: number;
    reason: string;
    rejectionReason: string | null;
    approvals: ApprovalModel[];
  }) {
    this.id = id;
    this.leaveType = leaveType;
    this.applicationType = applicationType;
    this.status = status;
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.appliedOn = appliedOn;
    this.totalDays = totalDays;
    this.reason = reason;
    this.rejectionReason = rejectionReason;
    this.approvals = approvals;
  }

  static fromJson(json: LeaveJson): LeaveModel {
    return new LeaveModel({
      id: json.id,
      leaveType: json.leaveType,
      applicationType: json.applicationType,
      status: json.status,
      fromDate: json.fromDate,
      toDate: json.toDate,
      appliedOn: json.appliedOn,
      totalDays: json.totalDays,
      reason: json.reason,
      rejectionReason: json.rejectionReason,
      approvals: json.approvals.map(item =>
        ApprovalModel.fromJson(item),
      ),
    });
  }
}

/* -------------------------------------------------------------------------- */
/* Leave Details Data Model                                                   */
/* -------------------------------------------------------------------------- */

export class LeaveDetailsDataModel {
  leave: LeaveModel;
  earnedLeave: number;

  constructor({
    leave,
    earnedLeave,
  }: {
    leave: LeaveModel;
    earnedLeave: number;
  }) {
    this.leave = leave;
    this.earnedLeave = earnedLeave;
  }

  static fromJson(json: LeaveDetailsDataJson): LeaveDetailsDataModel {
    return new LeaveDetailsDataModel({
      leave: LeaveModel.fromJson(json.leave),
      earnedLeave: Number(json.earned_leave),
    });
  }
}

/* -------------------------------------------------------------------------- */
/* API                                                                         */
/* -------------------------------------------------------------------------- */

export const getLeaveDetails = async (
  leaveId: number | string,
): Promise<LeaveDetailsDataModel> => {
  const json = await RestApi.get<LeaveDetailsResponseJson>(
    `/api/leaves/leave-details/${leaveId}`,
  );

  if (!json) {
    throw new Error('Unable to load leave details');
  }

  if (!json.data) {
    throw new Error(json.message || 'Unable to load leave details');
  }

  if (!(json.success === true || json.success === 'true')) {
    throw new Error(json.message || 'Unable to load leave details');
  }

  return LeaveDetailsDataModel.fromJson(json.data);
};

