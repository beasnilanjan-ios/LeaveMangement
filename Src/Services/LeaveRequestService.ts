import RestApi from './RestApi';

export interface LeaveRequestApiItem {
    id: number;
    employee_id: number;
    manager_id: string | number | null;
    leave_type: string;
    start_date: string;
    end_date: string;
    no_of_days: number;
    reason: string;
    status: string;
    created_at: string;
    duration: string;
    is_restricted: number | string;
    rejection_reason: string | null;
    employee_name?: string;
    designation?: string;
    manager_status?: string | null;
    global_status?: string | null;
    approvalDetails?: Array<{
        manager_id: number | string;
        manager_name: string;
        designation: string;
        status: string;
        date: string | null;
    }>;
}

export interface LeaveRequestApiResponse {
    success: boolean | string;
    message: string;
    data?: {
        leaves: LeaveRequestApiItem[];
        earned_leave?: string;
    };
}

export interface LeaveRequestListItem {
    id: string;
    employeeId: number | string;
    employeeName: string;
    leaveType: string;
    designation: string;
    applicationType: string;
    fromDate: string;
    toDate: string;
    status: 'Approve' | 'Pending' | 'Rejected';
    appliedOn: string;
    no_of_days: number;
    duration: string;
    reason: string;
}

const normalizeStatus = (status: string): 'Approve' | 'Pending' | 'Rejected' => {
    const value = status?.toLowerCase();

    if (value === 'approved') {
        return 'Approve';
    }

    if (value === 'pending') {
        return 'Pending';
    }

    if (value === 'rejected') {
        return 'Rejected';
    }

    return 'Pending';
};

export const getAllLeaveRequests = async (
    search?: string,
): Promise<LeaveRequestListItem[]> => {
    const endpoint = search
        ? `/api/leaves/all?search=${encodeURIComponent(search)}`
        : '/api/leaves/all';

    const json = await RestApi.get<LeaveRequestApiResponse>(endpoint);

    if (!json) {
        throw new Error('Unable to load leave requests');
    }

    if (!(json.success === true || json.success === 'true')) {
        throw new Error(json.message || 'Unable to load leave requests');
    }

    const leaves = json.data?.leaves ?? [];

    return leaves.map(item => ({
        id: String(item.id),
        employeeId: item.employee_id,
        employeeName: item.employee_name || `Employee ${item.employee_id}`,
        leaveType:
            Number(item.is_restricted) === 0 ? item.leave_type || '' : 'Restricted Holiday',
        designation: item.designation || '',
        applicationType: item.duration || item.leave_type || 'Full Day',
        fromDate: item.start_date,
        toDate: item.end_date,
        status: normalizeStatus(item.status),
        appliedOn: item.created_at,
        no_of_days: Number(item.no_of_days ?? 0),
        duration: item.duration || 'Full Day',
        reason: item.reason || '',
    }));
};

export interface UpdateLeaveStatusPayload {
    noOfDays: number | string;
    status: 'Approved' | 'Rejected';
    rejection_reason?: string;
}

export interface UpdateLeaveStatusResponse {
    success: boolean | string;
    message: string;
    data?: Record<string, any>;
}

export const updateLeaveStatus = async (
    leaveId: number | string,
    payload: UpdateLeaveStatusPayload,
): Promise<UpdateLeaveStatusResponse> => {
    const json = await RestApi.put<UpdateLeaveStatusResponse>(
        `/api/leaves/${leaveId}/status`,
        payload,
    );

    if (!json) {
        throw new Error('Unable to update leave status');
    }

    if (!(json.success === true || json.success === 'true')) {
        throw new Error(json.message || 'Unable to update leave status');
    }

    return json;
};
