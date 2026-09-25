import RestApi from './RestApi';

export interface HolidayJson {
  id: number;
  date: string;
  day: string;
  purpose: string;
  type: string;
  number_of_days: number;
  year: number;
  created_at: string;
}

interface HolidaySummaryJson {
  totalLeave: string;
  balanceLeave: string;
  earlyLeave: string;
}

interface HolidayDataJson {
  holidayPeriod: string;
  leaveSummary: HolidaySummaryJson;
  holidayData: HolidayJson[];
}

export interface HolidayResponseJson {
  success: boolean | string;
  message: string;
  data?: HolidayDataJson;
}

export class HolidayModel {
  id: number;
  date: string;
  day: string;
  purpose: string;
  type: string;
  numberOfDays: number;
  year: number;
  createdAt: string;

  constructor({
    id,
    date,
    day,
    purpose,
    type,
    numberOfDays,
    year,
    createdAt,
  }: {
    id: number;
    date: string;
    day: string;
    purpose: string;
    type: string;
    numberOfDays: number;
    year: number;
    createdAt: string;
  }) {
    this.id = id;
    this.date = date;
    this.day = day;
    this.purpose = purpose;
    this.type = type;
    this.numberOfDays = numberOfDays;
    this.year = year;
    this.createdAt = createdAt;
  }

  static fromJson(json: HolidayJson): HolidayModel {
    return new HolidayModel({
      id: json.id,
      date: json.date,
      day: json.day,
      purpose: json.purpose,
      type: json.type,
      numberOfDays: json.number_of_days,
      year: json.year,
      createdAt: json.created_at,
    });
  }
}

export class HolidaySummaryModel {
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

  static fromJson(json: HolidaySummaryJson): HolidaySummaryModel {
    return new HolidaySummaryModel({
      totalLeave: Number(json.totalLeave),
      balanceLeave: Number(json.balanceLeave),
      earlyLeave: Number(json.earlyLeave),
    });
  }
}

export class HolidayDataModel {
  holidayPeriod: string;
  leaveSummary: HolidaySummaryModel;
  holidayData: HolidayModel[];

  constructor({
    holidayPeriod,
    leaveSummary,
    holidayData,
  }: {
    holidayPeriod: string;
    leaveSummary: HolidaySummaryModel;
    holidayData: HolidayModel[];
  }) {
    this.holidayPeriod = holidayPeriod;
    this.leaveSummary = leaveSummary;
    this.holidayData = holidayData;
  }

  static fromJson(json: HolidayDataJson): HolidayDataModel {
    return new HolidayDataModel({
      holidayPeriod: json.holidayPeriod,
      leaveSummary: HolidaySummaryModel.fromJson(json.leaveSummary),
      holidayData: json.holidayData.map(item =>
        HolidayModel.fromJson(item),
      ),
    });
  }
}

export const getHolidays = async (year: number): Promise<HolidayDataModel> => {
  const json = await RestApi.get<HolidayResponseJson>(`/api/holidays?year=${year}`);

  if (!json) {
    throw new Error('Unable to load holidays');
  }

  if (!json.data) {
    throw new Error(json.message || 'Unable to load holidays');
  }

  if (!(json.success === true || json.success === 'true')) {
    throw new Error(json.message || 'Unable to load holidays');
  }

  return HolidayDataModel.fromJson(json.data);
};