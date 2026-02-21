import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { buildBceCommerceDataset } from "@/lib/import/bce-import";

type CliOptions = {
  dataDir: string;
  naceVersion: string;
  naceCodes: string[];
};

const DEFAULT_NACE_VERSION = "2025";
const DEFAULT_NACE_CODES = ["47.22", "47.221", "47.222"];
const BATCH_SIZE = 1000;

const loadDotEnv = (): void => {
  const envPath = path.resolve(process.cwd(), ".env");
  if (!existsSync(envPath)) {
    return;
  }

  const content = readFileSync(envPath, "utf8");
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex <= 0) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^['"]|['"]$/g, "");

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
};

const parseArgs = (argv: string[]): CliOptions => {
  const options: Partial<CliOptions> = {
    naceVersion: DEFAULT_NACE_VERSION,
    naceCodes: [...DEFAULT_NACE_CODES]
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--data-dir") {
      options.dataDir = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === "--nace-version") {
      options.naceVersion = argv[i + 1];
      i += 1;
      continue;
    }
    if (arg === "--nace-codes") {
      const rawCodes = argv[i + 1] ?? "";
      const parsed = rawCodes
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean);
      options.naceCodes = parsed.length > 0 ? parsed : [...DEFAULT_NACE_CODES];
      i += 1;
      continue;
    }
    if (arg === "--nace-prefix") {
      throw new Error(
        "Argument --nace-prefix is no longer supported. Use --nace-codes with exact values."
      );
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  if (!options.dataDir) {
    throw new Error("Missing required argument: --data-dir");
  }

  return {
    dataDir: path.resolve(options.dataDir),
    naceVersion: options.naceVersion ?? DEFAULT_NACE_VERSION,
    naceCodes: options.naceCodes ?? [...DEFAULT_NACE_CODES]
  };
};

const chunk = <T>(items: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
};

loadDotEnv();

const prisma = new PrismaClient();

const main = async (): Promise<void> => {
  const options = parseArgs(process.argv.slice(2));

  const importRun = await prisma.importRun.create({
    data: {
      status: "RUNNING",
      dataDir: options.dataDir
    }
  });

  try {
    const dataset = await buildBceCommerceDataset({
      dataDir: options.dataDir,
      naceVersion: options.naceVersion,
      naceCodes: options.naceCodes
    });

    await prisma.commerce.deleteMany();

    let rowsInserted = 0;
    for (const rows of chunk(dataset.records, BATCH_SIZE)) {
      await prisma.commerce.createMany({
        data: rows.map((row) => ({
          ...row,
          importRunId: importRun.id
        }))
      });
      rowsInserted += rows.length;
    }

    await prisma.importRun.update({
      where: { id: importRun.id },
      data: {
        status: "SUCCESS",
        finishedAt: new Date(),
        snapshotDate: dataset.sourceSnapshotDate,
        extractTimestamp: dataset.sourceExtractedAt,
        rowsScanned: dataset.rowsScanned,
        rowsSelected: dataset.rowsSelected,
        rowsInserted,
        rowsSkipped: dataset.rowsSkipped
      }
    });

    // eslint-disable-next-line no-console
    console.log(
      `Import SUCCESS: selected=${dataset.rowsSelected} inserted=${rowsInserted} skipped=${dataset.rowsSkipped} codes=${options.naceCodes.join(",")}`
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);

    await prisma.importRun.update({
      where: { id: importRun.id },
      data: {
        status: "FAILED",
        finishedAt: new Date(),
        errorMessage: message
      }
    });

    throw error;
  } finally {
    await prisma.$disconnect();
  }
};

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exitCode = 1;
});
