/** "photos": cards show photos; "names": no photos, cards show the name's initials. Each mode has its own list. */
export type ParticipantMode = 'photos' | 'names';

export type Participant = {
  id: string;
  name: string;
  /** Photo URL; absent in the names-only mode. */
  src?: string;
};

/** A participant from the names-only list. */
export type NamedParticipant = {
  id: string;
  name: string;
};

/** A participant added in the browser; the photo lives in IndexedDB as a Blob. */
export type StoredParticipant = {
  id: string;
  name: string;
  blob: Blob;
};

export type WinnerRecord = {
  id: string;
  name: string;
};
