/**
 * @file googleCalendar.interfaces.ts
 * @description TypeScript interfaces for Google Calendar integration
 */

/**
 * Represents the connection status with Google Calendar
 */
export interface GoogleCalendarConnection {
  /** Whether the user is connected to Google Calendar */
  connected: boolean;
  /** The email associated with the Google Calendar account */
  email?: string;
  /** When the connection was established */
  connectedAt?: string;
  /** Last successful sync timestamp */
  lastSyncAt?: string;
  /** Available calendars from the connected account */
  calendars?: GoogleCalendarInfo[];
}

/**
 * Basic information about a Google Calendar
 */
export interface GoogleCalendarInfo {
  /** Google Calendar ID */
  id: string;
  /** Calendar display name */
  name: string;
  /** Whether this calendar is selected for sync */
  selected: boolean;
  /** Calendar color (hex) */
  color?: string;
  /** Whether this is the primary calendar */
  isPrimary?: boolean;
}

/**
 * Represents an event from Google Calendar
 */
export interface GoogleCalendarEvent {
  /** Google Event ID */
  id: string;
  /** Event title/summary */
  title: string;
  /** Event description */
  description?: string;
  /** Start date and time (ISO string) */
  startDateTime: string;
  /** End date and time (ISO string) */
  endDateTime: string;
  /** Whether this is an all-day event */
  allDay: boolean;
  /** Event location */
  location?: string;
  /** Google Meet link if available */
  meetLink?: string;
  /** List of attendee emails */
  attendees?: string[];
  /** Calendar ID this event belongs to */
  calendarId: string;
  /** Event status (confirmed, tentative, cancelled) */
  status: GoogleEventStatus;
  /** Link to the event in Google Calendar */
  htmlLink?: string;
  /** When the event was created */
  createdAt?: string;
  /** When the event was last updated */
  updatedAt?: string;
}

/**
 * Event status in Google Calendar
 */
export type GoogleEventStatus = 'confirmed' | 'tentative' | 'cancelled';

/**
 * Sync settings for Google Calendar integration
 */
export interface GoogleCalendarSyncSettings {
  /** Whether automatic sync is enabled */
  autoSync: boolean;
  /** Sync interval in minutes (e.g., 15, 30, 60) */
  syncInterval: number;
  /** Direction of sync */
  syncDirection: SyncDirection;
  /** Which calendars to sync from Google */
  selectedCalendarIds: string[];
  /** Whether to sync past events */
  syncPastEvents: boolean;
  /** How many days back to sync past events */
  pastEventsDays: number;
  /** Whether to sync future events */
  syncFutureEvents: boolean;
  /** How many days ahead to sync future events */
  futureEventsDays: number;
  /** Whether to include event descriptions */
  includeDescriptions: boolean;
  /** Whether to include attendees */
  includeAttendees: boolean;
}

/**
 * Direction of synchronization
 */
export type SyncDirection =
  | 'lexflow_to_google'  // Only push LexFlow meetings to Google
  | 'google_to_lexflow'  // Only import Google events to LexFlow
  | 'bidirectional';     // Sync both ways

/**
 * Result of a sync operation
 */
export interface SyncResult {
  /** Whether the sync was successful */
  success: boolean;
  /** When the sync started */
  startedAt: string;
  /** When the sync completed */
  completedAt: string;
  /** Number of events pushed to Google */
  eventsPushed: number;
  /** Number of events imported from Google */
  eventsImported: number;
  /** Number of events updated */
  eventsUpdated: number;
  /** Number of conflicts detected */
  conflicts: number;
  /** Error messages if any */
  errors?: string[];
}

/**
 * OAuth URL response from backend
 */
export interface GoogleAuthUrlResponse {
  /** OAuth authorization URL to redirect user to */
  authUrl: string;
  /** State parameter for CSRF protection */
  state?: string;
}

/**
 * Response after successful OAuth callback
 */
export interface GoogleAuthCallbackResponse {
  /** Whether authentication was successful */
  success: boolean;
  /** User's Google email */
  email?: string;
  /** Error message if authentication failed */
  error?: string;
}

/**
 * Request to sync meetings to Google Calendar
 */
export interface SyncToGoogleRequest {
  /** Optional: specific meeting IDs to sync */
  meetingIds?: string[];
  /** Whether to sync all meetings */
  syncAll?: boolean;
  /** Target calendar ID in Google */
  targetCalendarId?: string;
}

/**
 * Request to import events from Google Calendar
 */
export interface ImportFromGoogleRequest {
  /** Which calendars to import from */
  calendarIds: string[];
  /** Start date for import range */
  fromDate?: string;
  /** End date for import range */
  toDate?: string;
}

/**
 * Default sync settings
 */
export const DEFAULT_SYNC_SETTINGS: GoogleCalendarSyncSettings = {
  autoSync: false,
  syncInterval: 30,
  syncDirection: 'lexflow_to_google',
  selectedCalendarIds: [],
  syncPastEvents: false,
  pastEventsDays: 7,
  syncFutureEvents: true,
  futureEventsDays: 30,
  includeDescriptions: true,
  includeAttendees: true,
};
