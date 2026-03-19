import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

/**
 * Gets a fresh access token using a refresh token.
 */
export async function getGoogleAuthClient(refreshToken: string) {
  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });
  return oauth2Client;
}

/**
 * Creates an event in the user's primary Google Calendar.
 */
export async function createGoogleCalendarEvent(auth: any, reminder: { title: string, date: Date, time?: string | null }) {
  const calendar = google.calendar({ version: 'v3', auth });

  // Handle date and time
  let startDateTime, endDateTime;
  if (reminder.time) {
    const [hours, minutes] = reminder.time.split(':');
    const start = new Date(reminder.date);
    start.setHours(parseInt(hours), parseInt(minutes));
    
    const end = new Date(start);
    end.setHours(end.getHours() + 1); // Default to 1 hour event

    startDateTime = start.toISOString();
    endDateTime = end.toISOString();
  } else {
    // All day event if no time provided
    startDateTime = reminder.date.toISOString().split('T')[0];
    endDateTime = reminder.date.toISOString().split('T')[0]; // Same day
  }

  const event = {
    summary: reminder.title,
    start: reminder.time ? { dateTime: startDateTime } : { date: startDateTime },
    end: reminder.time ? { dateTime: endDateTime } : { date: endDateTime },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });
    return response.data.id;
  } catch (error) {
    console.error('Error creating Google Calendar event:', error);
    return null;
  }
}

/**
 * Updates an existing event in the user's primary Google Calendar.
 */
export async function updateGoogleCalendarEvent(auth: any, eventId: string, reminder: { title: string, date: Date, time?: string | null }) {
  const calendar = google.calendar({ version: 'v3', auth });

  let startDateTime, endDateTime;
  if (reminder.time) {
    const [hours, minutes] = reminder.time.split(':');
    const start = new Date(reminder.date);
    start.setHours(parseInt(hours), parseInt(minutes));
    
    const end = new Date(start);
    end.setHours(end.getHours() + 1);

    startDateTime = start.toISOString();
    endDateTime = end.toISOString();
  } else {
    startDateTime = reminder.date.toISOString().split('T')[0];
    endDateTime = reminder.date.toISOString().split('T')[0];
  }

  const event = {
    summary: reminder.title,
    start: reminder.time ? { dateTime: startDateTime } : { date: startDateTime },
    end: reminder.time ? { dateTime: endDateTime } : { date: endDateTime },
  };

  try {
    await calendar.events.update({
      calendarId: 'primary',
      eventId: eventId,
      requestBody: event,
    });
    return true;
  } catch (error) {
    console.error('Error updating Google Calendar event:', error);
    return false;
  }
}

/**
 * Deletes an event from the user's primary Google Calendar.
 */
export async function deleteGoogleCalendarEvent(auth: any, eventId: string) {
  const calendar = google.calendar({ version: 'v3', auth });

  try {
    await calendar.events.delete({
      calendarId: 'primary',
      eventId: eventId,
    });
    return true;
  } catch (error) {
    console.error('Error deleting Google Calendar event:', error);
    return false;
  }
}
