import { Prisma, PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  (() => {
    const resolvedDatabaseUrl =
      process.env.DATABASE_URL ??
      process.env.POSTGRES_PRISMA_URL ??
      process.env.POSTGRES_URL ??
      process.env.POSTGRES_URL_NON_POOLING;

    const options: Prisma.PrismaClientOptions = {
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
    };

    if (resolvedDatabaseUrl) {
      options.datasources = {
        db: {
          url: resolvedDatabaseUrl
        }
      };
    }

    return new PrismaClient(options);
  })();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
