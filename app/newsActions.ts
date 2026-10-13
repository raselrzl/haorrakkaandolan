"use server";
import { ContactFormState } from "./contactTypes";
import { prisma } from "./utils/db";


export type PublicNewsFilter =
  | "ALL"
  | "NEWS"
  | "ACTIVITY"
  | "RIVER"
  | "HAOR";

const PAGE_SIZE = 20;

/**
 * Existing action.
 * Kept for compatibility with other pages that use it.
 */
export async function getPublicNewsAction() {
  return prisma.news.findMany({
    select: {
      id: true,
      heading: true,
      details: true,
      mediaUrl: true,
      mediaType: true,
      riverOrHaor: true,
      type: true,
      createdAt: true,
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });
}

/**
 * Paginated public news and activities.
 * Fetches at most 21 rows to determine whether another page exists.
 * Returns only 20 rows to the client.
 */
export async function getPublicNewsPageAction({
  page = 1,
  filter = "ALL",
  search = "",
}: {
  page?: number;
  filter?: PublicNewsFilter;
  search?: string;
}) {
  const currentPage = Math.max(
    1,
    Math.floor(Number.isFinite(page) ? page : 1),
  );

  const query = search.trim().slice(0, 150);

  const where = {
    ...(filter === "NEWS" || filter === "ACTIVITY"
      ? { type: filter }
      : {}),

    ...(filter === "RIVER" || filter === "HAOR"
      ? { riverOrHaor: filter }
      : {}),

    ...(query
      ? {
          OR: [
            {
              heading: {
                contains: query,
                mode: "insensitive" as const,
              },
            },
            {
              details: {
                contains: query,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
  };

  const results = await prisma.news.findMany({
    where,
    select: {
      id: true,
      heading: true,
      details: true,
      mediaUrl: true,
      mediaType: true,
      riverOrHaor: true,
      type: true,
      createdAt: true,
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE + 1,
  });

  return {
    items: results.slice(0, PAGE_SIZE),
    hasMore: results.length > PAGE_SIZE,
    page: currentPage,
    pageSize: PAGE_SIZE,
  };
}



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

export async function getHomepageNews(): Promise<{
  updates: HomepageNewsItem[];
  news: HomepageNewsItem[];
}> {
  const [updates, news] = await Promise.all([
    prisma.news.findMany({
      where: { type: "ACTIVITY" },
      orderBy: { createdAt: "desc" },
      take: 4,
      select: {
        id: true,
        heading: true,
        createdAt: true,
        type: true,
        riverOrHaor: true,
      },
    }),

    prisma.news.findMany({
      where: { type: "NEWS" },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        heading: true,
        createdAt: true,
        type: true,
        riverOrHaor: true,
      },
    }),
  ]);

  return {
    updates: updates.map((item) => ({
      ...item,
      createdAt: item.createdAt.toISOString(),
    })),
    news: news.map((item) => ({
      ...item,
      createdAt: item.createdAt.toISOString(),
    })),
  };
}

export async function getNewsById(
  id: string,
): Promise<NewsDetailsItem | null> {
  if (!id || id.length > 100) {
    return null;
  }

  const item = await prisma.news.findUnique({
    where: { id },
    select: {
      id: true,
      heading: true,
      details: true,
      mediaUrl: true,
      mediaType: true,
      riverOrHaor: true,
      type: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!item) {
    return null;
  }

  return {
    id: item.id,
    heading: item.heading,
    details: item.details,
    mediaUrl: item.mediaUrl,
    mediaType: item.mediaType,
    riverOrHaor: item.riverOrHaor,
    type: item.type,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
    author: item.user.name,
  };
}


/* export type ContactFormState = {
  success: boolean;
  message: string;
};

export const initialContactFormState: ContactFormState = {
  success: false,
  message: "",
}; */


export async function contactMessageAction(
  _previousState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const reason = String(formData.get("reason") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const message = String(formData.get("message") ?? "").trim();
  const website = String(formData.get("website") ?? "").trim();

  if (website) {
    return {
      success: true,
      message: "Thank you! Your message has been received.",
    };
  }

  if (!reason || !name || !phone || !email || !message) {
    return {
      success: false,
      message: "Please complete all required fields.",
    };
  }

  if (reason.length > 100) {
    return {
      success: false,
      message: "Please keep the reason under 100 characters.",
    };
  }

  if (name.length > 100) {
    return {
      success: false,
      message: "Your name must be 100 characters or fewer.",
    };
  }

  if (phone.length > 30) {
    return {
      success: false,
      message: "Your phone number must be 30 characters or fewer.",
    };
  }

  if (
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return {
      success: false,
      message: "Please enter a valid email address.",
    };
  }

  if (message.length < 5 || message.length > 10000) {
    return {
      success: false,
      message: "Your message must be between 5 and 10,000 characters.",
    };
  }

  try {
    await prisma.contactMessage.create({
      data: {
        reason,
        name,
        phone,
        email,
        message,
      },
    });

    return {
      success: true,
      message:
        "Your message has been sent successfully. Thank you for contacting Haor Rokkha Andolan!",
    };
  } catch (error) {
    console.error("Unable to save contact message:", error);

    return {
      success: false,
      message:
        "We couldn't send your message right now. Please try again later.",
    };
  }
}