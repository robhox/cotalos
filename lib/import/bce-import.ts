import { createReadStream } from "node:fs";
import { access } from "node:fs/promises";
import path from "node:path";
import { parse } from "csv-parse";

import type { CommerceCategory } from "@/lib/types";

type CsvRow = Record<string, string>;

type RankedValue = {
  rank: number;
  value: string;
};

type AddressValue = {
  country: string;
  postalCode: string;
  city: string;
  street: string;
  houseNumber: string;
  box: string;
};

type ContactValue = {
  phone?: string;
  email?: string;
  website?: string;
};

type CandidateActivity = {
  primaryNaceCode: string;
  category: CommerceCategory;
  matchedNaceCodes: Set<string>;
};

export type BuildBceCommerceDatasetOptions = {
  dataDir: string;
  naceVersion?: string;
  naceCodes?: string[];
  source?: string;
};

export type PreparedCommerceRecord = {
  establishmentNumber: string;
  enterpriseNumber: string;
  name: string;
  slug: string;
  category: CommerceCategory;
  naceVersion: string;
  naceCode: string;
  matchedNaceCodes: string[];
  addressLine: string;
  postalCode: string;
  city: string;
  country: string;
  phone?: string;
  email?: string;
  website?: string;
  source: string;
  sourceSnapshotDate?: Date;
  sourceExtractedAt?: Date;
};

export type BuildBceCommerceDatasetResult = {
  rowsScanned: number;
  rowsSelected: number;
  rowsInsertedCandidateCount: number;
  rowsSkipped: number;
  sourceSnapshotDate?: Date;
  sourceExtractedAt?: Date;
  records: PreparedCommerceRecord[];
};

const DATA_FILES = [
  "meta.csv",
  "activity.csv",
  "establishment.csv",
  "address.csv",
  "denomination.csv",
  "contact.csv"
] as const;

const DEFAULT_NACE_VERSION = "2025";
const DEFAULT_SOURCE = "bce-kbo";
const LANGUAGE_FR = "1";
const LANGUAGE_NL = "2";
const DEFAULT_NACE_CODES = [
  "47.22",
  "47.221",
  "47.222"
] as const;
const EXACT_NACE_CATEGORY_MAP: Record<string, CommerceCategory> = {
  "4722": "boucherie",
  "47221": "boucherie",
  "47222": "boucherie"
};

const toValue = (input: string | undefined): string => (input ?? "").trim();
const normalizeNaceCode = (value: string): string => toValue(value).replace(/[^0-9]/g, "");

const isActiveAddress = (dateStrikingOff: string): boolean => toValue(dateStrikingOff) === "";

export const parseBelgianDate = (rawValue: string): Date | undefined => {
  const value = toValue(rawValue);
  if (!value) {
    return undefined;
  }

  const match = value.match(/^(\d{2})-(\d{2})-(\d{4})(?: (\d{2}):(\d{2})(?::(\d{2}))?)?$/);
  if (!match) {
    return undefined;
  }

  const [, dd, mm, yyyy, hh = "00", min = "00", sec = "00"] = match;

  return new Date(Date.UTC(Number(yyyy), Number(mm) - 1, Number(dd), Number(hh), Number(min), Number(sec)));
};

export const slugify = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");

export const getEstablishmentDenominationPriority = (typeOfDenomination: string, language: string): number | null => {
  if (typeOfDenomination !== "003") {
    return null;
  }

  if (language === LANGUAGE_FR) {
    return 1;
  }

  if (language === LANGUAGE_NL) {
    return 2;
  }

  return 3;
};

export const getEnterpriseDenominationPriority = (typeOfDenomination: string, language: string): number | null => {
  if (typeOfDenomination === "001") {
    if (language === LANGUAGE_FR) {
      return 4;
    }
    if (language === LANGUAGE_NL) {
      return 5;
    }
    return 6;
  }

  if (typeOfDenomination === "002") {
    return 7;
  }

  return null;
};

const getContactField = (contactType: string): keyof ContactValue | null => {
  if (contactType === "TEL") {
    return "phone";
  }
  if (contactType === "EMAIL") {
    return "email";
  }
  if (contactType === "WEB") {
    return "website";
  }
  return null;
};

const setBestRankedValue = (map: Map<string, RankedValue>, key: string, rank: number, value: string): void => {
  const current = map.get(key);
  if (!current || rank < current.rank) {
    map.set(key, { rank, value });
  }
};

const assignContactValue = (contactMap: Map<string, ContactValue>, key: string, contactType: string, value: string): void => {
  const field = getContactField(contactType);
  if (!field) {
    return;
  }

  const current = contactMap.get(key) ?? {};
  if (!current[field]) {
    current[field] = value;
    contactMap.set(key, current);
  }
};

const toAddressValue = (row: CsvRow): AddressValue => ({
  country: toValue(row.CountryFR) || toValue(row.CountryNL) || "BE",
  postalCode: toValue(row.Zipcode),
  city: toValue(row.MunicipalityFR) || toValue(row.MunicipalityNL),
  street: toValue(row.StreetFR) || toValue(row.StreetNL),
  houseNumber: toValue(row.HouseNumber),
  box: toValue(row.Box)
});

export const buildAddressLine = (street: string, houseNumber: string, box: string): string => {
  const line = [street, houseNumber].filter(Boolean).join(" ").trim();
  if (!line) {
    return "";
  }
  if (!box) {
    return line;
  }
  return `${line} ${box}`;
};

const normalizeNumberForSlug = (value: string): string => value.replace(/[^0-9]/g, "");

export const buildCommerceSlug = (name: string, postalCode: string, establishmentNumber: string): string => {
  const baseName = slugify(name) || "boucherie";
  const postal = slugify(postalCode) || "na";
  const suffix = normalizeNumberForSlug(establishmentNumber);
  return `${baseName}-${postal}-${suffix}`;
};

const csvParserOptions = {
  columns: true,
  trim: true,
  skip_empty_lines: true,
  bom: true,
  relax_column_count: true
} as const;

const streamCsv = async (filePath: string, onRow: (row: CsvRow) => void): Promise<number> => {
  let rowCount = 0;
  const parser = createReadStream(filePath).pipe(parse(csvParserOptions));

  for await (const rawRow of parser) {
    rowCount += 1;
    onRow(rawRow as CsvRow);
  }

  return rowCount;
};

const ensureFilesExist = async (dataDir: string): Promise<void> => {
  await Promise.all(
    DATA_FILES.map(async (filename) => {
      const filePath = path.join(dataDir, filename);
      await access(filePath);
    })
  );
};

export const buildBceCommerceDataset = async (
  input: BuildBceCommerceDatasetOptions
): Promise<BuildBceCommerceDatasetResult> => {
  const dataDir = path.resolve(input.dataDir);
  const naceVersion = input.naceVersion ?? DEFAULT_NACE_VERSION;
  const exactNaceCodes = (input.naceCodes ?? [...DEFAULT_NACE_CODES]).map(normalizeNaceCode);
  const source = input.source ?? DEFAULT_SOURCE;
  const allowedCodeToCategory = new Map<string, CommerceCategory>();

  for (const code of exactNaceCodes) {
    const category = EXACT_NACE_CATEGORY_MAP[code];
    if (!category) {
      throw new Error(
        `Unsupported exact NACE code "${code}". Allowed values: ${Object.keys(EXACT_NACE_CATEGORY_MAP).join(", ")}`
      );
    }
    allowedCodeToCategory.set(code, category);
  }

  await ensureFilesExist(dataDir);

  let rowsScanned = 0;
  let sourceSnapshotDate: Date | undefined;
  let sourceExtractedAt: Date | undefined;

  const candidateActivities = new Map<string, CandidateActivity>();
  const establishmentToEnterprise = new Map<string, string>();
  const selectedEnterpriseNumbers = new Set<string>();
  const establishmentAddresses = new Map<string, AddressValue>();
  const enterpriseRegoAddresses = new Map<string, AddressValue>();
  const establishmentNames = new Map<string, RankedValue>();
  const enterpriseNames = new Map<string, RankedValue>();
  const establishmentContacts = new Map<string, ContactValue>();
  const enterpriseContacts = new Map<string, ContactValue>();

  rowsScanned += await streamCsv(path.join(dataDir, "meta.csv"), (row) => {
    const key = toValue(row.Variable);
    const value = toValue(row.Value);

    if (key === "SnapshotDate") {
      sourceSnapshotDate = parseBelgianDate(value);
    } else if (key === "ExtractTimestamp") {
      sourceExtractedAt = parseBelgianDate(value);
    }
  });

  rowsScanned += await streamCsv(path.join(dataDir, "activity.csv"), (row) => {
    const entityNumber = toValue(row.EntityNumber);
    const rowNaceVersion = toValue(row.NaceVersion);
    const rowNaceCode = normalizeNaceCode(row.NaceCode);
    const classification = toValue(row.Classification);

    if (!entityNumber.startsWith("2.")) {
      return;
    }
    if (rowNaceVersion !== naceVersion) {
      return;
    }
    if (classification !== "MAIN") {
      return;
    }
    const category = allowedCodeToCategory.get(rowNaceCode);
    if (!category) {
      return;
    }

    const current = candidateActivities.get(entityNumber);
    if (!current) {
      candidateActivities.set(entityNumber, {
        primaryNaceCode: rowNaceCode,
        category,
        matchedNaceCodes: new Set([rowNaceCode])
      });
      return;
    }

    current.matchedNaceCodes.add(rowNaceCode);
    if (rowNaceCode.length > current.primaryNaceCode.length) {
      current.primaryNaceCode = rowNaceCode;
      current.category = category;
    }
  });

  rowsScanned += await streamCsv(path.join(dataDir, "establishment.csv"), (row) => {
    const establishmentNumber = toValue(row.EstablishmentNumber);
    if (!candidateActivities.has(establishmentNumber)) {
      return;
    }

    const enterpriseNumber = toValue(row.EnterpriseNumber);
    if (!enterpriseNumber) {
      return;
    }

    establishmentToEnterprise.set(establishmentNumber, enterpriseNumber);
    selectedEnterpriseNumbers.add(enterpriseNumber);
  });

  rowsScanned += await streamCsv(path.join(dataDir, "address.csv"), (row) => {
    const entityNumber = toValue(row.EntityNumber);
    const typeOfAddress = toValue(row.TypeOfAddress);
    const dateStrikingOff = toValue(row.DateStrikingOff);
    if (!isActiveAddress(dateStrikingOff)) {
      return;
    }

    if (candidateActivities.has(entityNumber) && typeOfAddress === "BAET" && !establishmentAddresses.has(entityNumber)) {
      establishmentAddresses.set(entityNumber, toAddressValue(row));
      return;
    }

    if (selectedEnterpriseNumbers.has(entityNumber) && typeOfAddress === "REGO" && !enterpriseRegoAddresses.has(entityNumber)) {
      enterpriseRegoAddresses.set(entityNumber, toAddressValue(row));
    }
  });

  rowsScanned += await streamCsv(path.join(dataDir, "denomination.csv"), (row) => {
    const entityNumber = toValue(row.EntityNumber);
    const language = toValue(row.Language);
    const typeOfDenomination = toValue(row.TypeOfDenomination);
    const denomination = toValue(row.Denomination);
    if (!denomination) {
      return;
    }

    if (candidateActivities.has(entityNumber)) {
      const establishmentPriority = getEstablishmentDenominationPriority(typeOfDenomination, language);
      if (establishmentPriority !== null) {
        setBestRankedValue(establishmentNames, entityNumber, establishmentPriority, denomination);
      }
      return;
    }

    if (selectedEnterpriseNumbers.has(entityNumber)) {
      const enterprisePriority = getEnterpriseDenominationPriority(typeOfDenomination, language);
      if (enterprisePriority !== null) {
        setBestRankedValue(enterpriseNames, entityNumber, enterprisePriority, denomination);
      }
    }
  });

  rowsScanned += await streamCsv(path.join(dataDir, "contact.csv"), (row) => {
    const entityNumber = toValue(row.EntityNumber);
    const entityContact = toValue(row.EntityContact);
    const contactType = toValue(row.ContactType);
    const value = toValue(row.Value);
    if (!value) {
      return;
    }

    if (candidateActivities.has(entityNumber) && entityContact === "EST") {
      assignContactValue(establishmentContacts, entityNumber, contactType, value);
      return;
    }

    if (selectedEnterpriseNumbers.has(entityNumber) && entityContact === "ENT") {
      assignContactValue(enterpriseContacts, entityNumber, contactType, value);
    }
  });

  let rowsSkipped = 0;
  const records: PreparedCommerceRecord[] = [];

  const sortedEstablishments = Array.from(candidateActivities.keys()).sort((a, b) => a.localeCompare(b));
  for (const establishmentNumber of sortedEstablishments) {
    const candidate = candidateActivities.get(establishmentNumber);
    if (!candidate) {
      rowsSkipped += 1;
      continue;
    }

    const enterpriseNumber = establishmentToEnterprise.get(establishmentNumber);
    if (!enterpriseNumber) {
      rowsSkipped += 1;
      continue;
    }

    const address = establishmentAddresses.get(establishmentNumber) ?? enterpriseRegoAddresses.get(enterpriseNumber);
    if (!address) {
      rowsSkipped += 1;
      continue;
    }

    const name =
      establishmentNames.get(establishmentNumber)?.value ??
      enterpriseNames.get(enterpriseNumber)?.value;
    if (!name) {
      rowsSkipped += 1;
      continue;
    }

    const addressLine = buildAddressLine(address.street, address.houseNumber, address.box);
    if (!addressLine || !address.postalCode || !address.city) {
      rowsSkipped += 1;
      continue;
    }

    const establishmentContact = establishmentContacts.get(establishmentNumber);
    const enterpriseContact = enterpriseContacts.get(enterpriseNumber);
    const matchedNaceCodes = Array.from(candidate.matchedNaceCodes).sort((a, b) => a.localeCompare(b));

    records.push({
      establishmentNumber,
      enterpriseNumber,
      name,
      slug: buildCommerceSlug(name, address.postalCode, establishmentNumber),
      category: candidate.category,
      naceVersion,
      naceCode: candidate.primaryNaceCode,
      matchedNaceCodes,
      addressLine,
      postalCode: address.postalCode,
      city: address.city,
      country: address.country || "BE",
      phone: establishmentContact?.phone ?? enterpriseContact?.phone,
      email: establishmentContact?.email ?? enterpriseContact?.email,
      website: establishmentContact?.website ?? enterpriseContact?.website,
      source,
      sourceSnapshotDate,
      sourceExtractedAt
    });
  }

  return {
    rowsScanned,
    rowsSelected: candidateActivities.size,
    rowsInsertedCandidateCount: records.length,
    rowsSkipped,
    sourceSnapshotDate,
    sourceExtractedAt,
    records
  };
};
