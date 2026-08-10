import { BASE_URL } from './ApiConfig';
import { getAuthToken } from './AuthSession';

export interface LeaveRequestJson {
  id: string;
  type: string;
  applicationType: string;
  fromDate: string;
  toDate: string;
  status: string;
  reason: string;
}

interface LeaveSummaryJson {
  totalLeave: string;
  balanceLeave: string;
  earlyLeave: string;
}

interface DashboardDataJson {
  leaveRequestByEmployee: string;
  leaveSummary: LeaveSummaryJson;
  leaveRequests: LeaveRequestJson[];
}

export interface DashboardResponseJson {
  success: boolean | string;
  message: string;
  data?: DashboardDataJson;
}

export class LeaveSummaryModel {
  totalLeave: number;
  balanceLeave: number;
  earlyLeave: number;

  constructor({
    totalLeave,
    balanceLeave,
    earlyLeave,
  }: {
    totalLeave: number;
    balanceLeave: number;
    earlyLeave: number;
  }) {
    this.totalLeave = totalLeave;
    this.balanceLeave = balanceLeave;
    this.earlyLeave = earlyLeave;
  }

  static fromJson(json: LeaveSummaryJson): LeaveSummaryModel {
    return new LeaveSummaryModel({
      totalLeave: Number(json.totalLeave),
      balanceLeave: Number(json.balanceLeave),
      earlyLeave: Number(json.earlyLeave),
    });
  }
}

export class LeaveRequestModel {
  id: string;
  type: string;
  applicationType: string;
  fromDate: string;
  toDate: string;
  status: string;
  reason: string;

  constructor({
    id,
    type,
    applicationType,
    fromDate,
    toDate,
    status,
    reason,
  }: {
    id: string;
    type: string;
    applicationType: string;
    fromDate: string;
    toDate: string;
    status: string;
    reason: string;
  }) {
    this.id = id;
    this.type = type;
    this.applicationType = applicationType;
    this.fromDate = fromDate;
    this.toDate = toDate;
    this.status = status;
    this.reason = reason;
  }

  static fromJson(json: LeaveRequestJson): LeaveRequestModel {
    return new LeaveRequestModel({
      id: json.id,
      type: json.type,
      applicationType: json.applicationType,
      fromDate: json.fromDate,
      toDate: json.toDate,
      status: normalizeStatus(json.status),
      reason: json.reason,
    });
  }
}

const normalizeStatus = (status: string) => {
  switch (status.toLowerCase()) {
    case 'approved':
      return 'Approve';
    case 'rejected':
      return 'Rejected';
    case 'pending':
      return 'Pending';
    default:
      return status;
  }
};

export class DashboardDataModel {
  leaveRequestByEmployee: string;
  leaveSummary: LeaveSummaryModel;
  leaveRequests: LeaveRequestModel[];

  constructor({
    leaveRequestByEmployee,
    leaveSummary,
    leaveRequests,
  }: {
    leaveRequestByEmployee: string;
    leaveSummary: LeaveSummaryModel;
    leaveRequests: LeaveRequestModel[];
  }) {
    this.leaveRequestByEmployee = leaveRequestByEmployee;
    this.leaveSummary = leaveSummary;
    this.leaveRequests = leaveRequests;
  }

  static fromJson(json: DashboardDataJson): DashboardDataModel {
    return new DashboardDataModel({
      leaveRequestByEmployee: json.leaveRequestByEmployee,
      leaveSummary: LeaveSummaryModel.fromJson(json.leaveSummary),
      leaveRequests: json.leaveRequests.map(item =>
        LeaveRequestModel.fromJson(item),
      ),
    });
  }
}

export const getDashboard = async (): Promise<DashboardDataModel> => {
  const token = getAuthToken();

  const response = await fetch(`${BASE_URL}/api/dashboard`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const json = (await response.json()) as DashboardResponseJson;

  if (!response.ok) {
    throw new Error(json.message || 'Unable to load dashboard');
  }

  if (!json.data) {
    throw new Error(json.message || 'Unable to load dashboard');
  }

  const dashboardData = DashboardDataModel.fromJson(json.data);

  if (!(json.success === true || json.success === 'true')) {
    throw new Error(json.message || 'Unable to load dashboard');
  }

  return dashboardData;
};
