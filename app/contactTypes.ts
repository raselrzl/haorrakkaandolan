
export type ContactFormState = {
  success: boolean;
  message: string;
};

export const initialContactFormState: ContactFormState = {
  success: false,
  message: "",
};

export type PublicNewsFilter =
  | "ALL"
  | "NEWS"
  | "ACTIVITY"
  | "RIVER"
  | "HAOR";

export type HomepageNewsItem = {
  id: string;
  heading: string;
  createdAt: string;
  type: "NEWS" | "ACTIVITY";
  riverOrHaor: "RIVER" | "HAOR";
};

export type NewsDetailsItem = {
  id: string;
  heading: string;
  details: string;
  mediaUrl: string | null;
  mediaType: "IMAGE" | "VIDEO" | null;
  riverOrHaor: "RIVER" | "HAOR";
  type: "NEWS" | "ACTIVITY";
  createdAt: string;
  updatedAt: string;
  author: string;
};
