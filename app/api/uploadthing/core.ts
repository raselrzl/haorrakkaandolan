import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 10,
    },
    video: {
      maxFileSize: "64MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      // Authentication is handled by client props.
      return {
        ok: true,
      };
    })
    .onUploadComplete(async ({ file, metadata }) => {
      return {
        url: file.url,
        name: file.name,
      };
    }),

  pdfUploader: f({
    "application/pdf": {
      maxFileSize: "16MB",
      maxFileCount: 5,
    },
  })
    .middleware(async () => {
      return { ok: true };
    })
    .onUploadComplete(async ({ file }) => {
      return {
        url: file.url,
        name: file.name,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
