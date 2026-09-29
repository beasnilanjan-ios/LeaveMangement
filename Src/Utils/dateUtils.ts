export const parseDateValue = (value: string | Date | null | undefined): Date | null => {
    if (!value) {
        return null;
    }

    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? null : value;
    }

    const trimmed = value.trim();

    if (!trimmed) {
        return null;
    }

    const apiMatch = trimmed.match(/^([0-9]{2})-([0-9]{2})-([0-9]{4})$/);
    if (apiMatch) {
        const [, day, month, year] = apiMatch;
        const parsed = new Date(`${year}-${month}-${day}T00:00:00`);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    }

    const isoMatch = trimmed.match(/^([0-9]{4})-([0-9]{2})-([0-9]{2})$/);
    if (isoMatch) {
        const [, year, month, day] = isoMatch;
        const parsed = new Date(`${year}-${month}-${day}T00:00:00`);
        return Number.isNaN(parsed.getTime()) ? null : parsed;
    }

    const parsed = new Date(trimmed);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const formatApiDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

export const formatCalendarDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export const formatDisplayDate = (
    value: string | Date | null | undefined,
    options?: Intl.DateTimeFormatOptions,
): string => {
    const date = parseDateValue(value);

    if (!date) {
        return value ? String(value) : '';
    }

    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        ...options,
    });
};

export const formatDisplayMonthYear = (value: string | Date | null | undefined): string => {
    const date = parseDateValue(value);

    if (!date) {
        return value ? String(value) : '';
    }

    return date.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
    });
};

export const formatDisplayDayMonth = (value: string | Date | null | undefined): string => {
    const date = parseDateValue(value);

    if (!date) {
        return value ? String(value) : '';
    }

    return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
    });
};

export const normalizeApiDateString = (value: string | null | undefined): string => {
    const date = parseDateValue(value);
    return date ? formatApiDate(date) : value ?? '';
};

export const calendarDateFromApi = (value: string | null | undefined): string => {
    const date = parseDateValue(value);
    return date ? formatCalendarDate(date) : '';
};
