export const fetchEmployees = async () => {
    const response = await fetch('/api/employees');
    if (!response.ok) {
        throw new Error('Failed to fetch employees');
    }
    return response.json();
};

export const fetchDocuments = async () => {
    const response = await fetch('/api/documents');
    if (!response.ok) {
        throw new Error('Failed to fetch documents');
    }
    return response.json();
};

export const fetchCalendarEvents = async () => {
    const response = await fetch('/api/calendar-events');
    if (!response.ok) {
        throw new Error('Failed to fetch calendar events');
    }
    return response.json();
};