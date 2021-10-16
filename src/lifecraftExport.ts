export type Emotion = {
  startDate: string;
  code: number;
  endDate: string;
  isEndDateVisible: boolean;
  intensity: number;
  dateAssigned: string;
  isDateVisible: boolean;
  text: string;
};

export type Attachment = {
  thumbnailIdentifier: string;
  identifier: string;
  type: string;
  filename: string;
  thumbnailLargeIdentifier: string;
};

export type LifecraftEntry = {
  content: string;
  tags: string[];
  latitude: number;
  timeZone: string;
  dateAssigned: string;
  favorite: boolean;
  dateCreated: string;
  emotions: Emotion[];
  text: string;
  longitude: number;
  dateEdited: string;
  attachments: Attachment[];
  identifier: string;
};

export type LifecraftExportMetadata = {
  version: string;
};

export type LifecraftExport = {
  entries: LifecraftEntry[];
  metadata: LifecraftExportMetadata;
};

export type FlattenedLifecraftEntry = {
  timestamp: string;
  tags: string[] | undefined;
  attachments: string[] | undefined;
  emotions: string[] | undefined;
};

export const emotions: string[][] = [
  [
    "Happy",
    "Cheerful",
    "Delighted",
    "Joyful",
    "Amused",
    "Proud",
    "Satisfied",
    "Grateful",
    "Relieved",
  ],
  [
    "Loving",
    "Affectionate",
    "Admiring",
    "Trusting",
    "Caring",
    "Attracted",
    "Passionate",
    "Longing",
    "Infatuated",
  ],
  [
    "Optimistic",
    "Interested",
    "Eager",
    "Enthusiastic",
    "Hopeful",
    "Confident",
    "Motivated",
    "Excited",
    "Exhilarated",
  ],
  [
    "Surprised",
    "Amazed",
    "Astonished",
    "Awestruck",
    "Shocked",
    "Stunned",
    "Confused",
    "Bewildered",
    "Wonder",
  ],
  [
    "Afraid",
    "Nervous",
    "Uneasy",
    "Tense",
    "Worried",
    "Panicked",
    "Terrified",
    "Insecure",
    "Shy",
  ],
  [
    "Sad",
    "Disappointed",
    "Depressed",
    "Hopeless",
    "Hurt",
    "Lonely",
    "Embarrassed",
    "Guilty",
    "Grieving",
  ],
  [
    "Bored",
    "Tired",
    "Restless",
    "Dissatisfied",
    "Distracted",
    "Frustrated",
    "Uncomfortable",
    "Disgusted",
    "Envious",
  ],
  [
    "Angry",
    "Annoyed",
    "Grumpy",
    "Bitter",
    "Hostile",
    "Furious",
    "Hateful",
    "Insulted",
    "Resentful",
  ],
];
export const formatMapping: Record<string, string> = {
  jpeg: "jpg",
};
