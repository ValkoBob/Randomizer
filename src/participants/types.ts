export type Participant = {
  id: string;
  name: string;
  src: string;
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
