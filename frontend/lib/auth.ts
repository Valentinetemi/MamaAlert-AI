import type { User } from '@supabase/supabase-js';
import type { UserData } from '@/components/onboarding';

const STORAGE_PREFIX = 'mama_alert_user_';

export function profileStorageKey(userId: string) {
  return `${STORAGE_PREFIX}${userId}`;
}

export function userDataFromMetadata(user: User): Partial<UserData> {
  const meta = user.user_metadata ?? {};
  return {
    name: (meta.full_name as string) || '',
    dueDate: (meta.due_date as string) || '',
    hospital: (meta.hospital as string) || '',
    location: (meta.location as string) || '',
    city: (meta.city as string) || '',
    state: (meta.state as string) || '',
    lang: (meta.lang as UserData['lang']) || 'en',
    phone: (meta.phone as string) || '',
    lastVisit: (meta.last_visit as string) || '',
    nextAppointment: (meta.next_appointment as string) || '',
    onboardingComplete: Boolean(meta.onboarding_complete),
    waterCount: typeof meta.water_count === 'number' ? meta.water_count : 0,
  };
}

export function loadStoredProfile(userId: string): UserData | null {
  try {
    const saved = localStorage.getItem(profileStorageKey(userId));
    if (!saved) return null;
    const parsed = JSON.parse(saved) as UserData;
    if (!parsed.onboardingComplete) return null;
    return {
      ...parsed,
      location: parsed.location ?? '',
      city: parsed.city ?? '',
      state: parsed.state ?? '',
    };
  } catch {
    return null;
  }
}

export function saveStoredProfile(userId: string, data: UserData) {
  try {
    localStorage.setItem(profileStorageKey(userId), JSON.stringify(data));
  } catch {
    // localStorage unavailable
  }
}

export function metadataFromUserData(data: UserData) {
  return {
    full_name: data.name,
    due_date: data.dueDate,
    hospital: data.hospital,
    location: data.location,
    city: data.city,
    state: data.state,
    lang: data.lang,
    phone: data.phone,
    last_visit: data.lastVisit,
    next_appointment: data.nextAppointment,
    onboarding_complete: data.onboardingComplete,
    water_count: data.waterCount,
  };
}

export function mergeProfile(user: User, stored: UserData | null): UserData | null {
  const fromMeta = userDataFromMetadata(user);

  if (stored?.onboardingComplete) {
    return stored;
  }

  if (fromMeta.onboardingComplete) {
    return {
      name: fromMeta.name || '',
      phone: fromMeta.phone || '',
      lang: fromMeta.lang || 'en',
      dueDate: fromMeta.dueDate || '',
      hospital: fromMeta.hospital || '',
      location: fromMeta.location || '',
      city: fromMeta.city || '',
      state: fromMeta.state || '',
      lastVisit: fromMeta.lastVisit || '',
      nextAppointment: fromMeta.nextAppointment || '',
      waterCount: fromMeta.waterCount ?? 0,
      onboardingComplete: true,
    };
  }

  return null;
}

export function seedOnboardingData(user: User): Partial<UserData> {
  const fromMeta = userDataFromMetadata(user);
  return {
    name: fromMeta.name || '',
    dueDate: fromMeta.dueDate || '',
    hospital: fromMeta.hospital || '',
    location: fromMeta.location || '',
    city: fromMeta.city || '',
    state: fromMeta.state || '',
    lang: fromMeta.lang || 'en',
    phone: fromMeta.phone || '',
    lastVisit: fromMeta.lastVisit || '',
    nextAppointment: fromMeta.nextAppointment || '',
  };
}
