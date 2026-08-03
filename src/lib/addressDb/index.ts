import { useQuery } from '@tanstack/react-query';
import type { Database, QueryExecResult } from 'sql.js';
import initSqlJs from 'sql.js';

const LIMIT = 100;

let dbPromise: Promise<Database> | null = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = initSqlJs({ locateFile: (f: string) => `/${f}` }).then(
      async (SQL) => {
        const buf = await fetch(
          'https://s3.rg.foxbyte.de/det-rg-main/det-rg-addresses.sqlite',
        ).then((r) => r.arrayBuffer());
        return new SQL.Database(new Uint8Array(buf));
      },
    );
  }
  return dbPromise;
}

// UTM32N → WGS84 (Näherung, <1m Abweichung für Regensburg)
function utmToWgs84(cx: number, cy: number): [number, number] {
  const a = 6378137,
    f = 1 / 298.257223563,
    k0 = 0.9996;
  const e2 = 2 * f - f * f,
    lon0 = 9 * (Math.PI / 180);
  const x = cx - 500000,
    y = cy;
  const M = y / k0;
  const mu = M / (a * (1 - e2 / 4 - (3 * e2 ** 2) / 64));
  const e1 = (1 - Math.sqrt(1 - e2)) / (1 + Math.sqrt(1 - e2));
  const phi1 =
    mu +
    ((3 * e1) / 2) * Math.sin(2 * mu) +
    ((21 * e1 ** 2) / 16) * Math.sin(4 * mu);
  const N1 = a / Math.sqrt(1 - e2 * Math.sin(phi1) ** 2);
  const T1 = Math.tan(phi1) ** 2,
    C1 = (e2 / (1 - e2)) * Math.cos(phi1) ** 2;
  const R1 = (a * (1 - e2)) / (1 - e2 * Math.sin(phi1) ** 2) ** 1.5;
  const D = x / (N1 * k0);
  const lat =
    phi1 -
    ((N1 * Math.tan(phi1)) / R1) *
      (D ** 2 / 2 - ((5 + 3 * T1 + 10 * C1) * D ** 4) / 24);
  const lon = lon0 + (D - ((1 + 2 * T1 + C1) * D ** 3) / 6) / Math.cos(phi1);
  return [lat * (180 / Math.PI), lon * (180 / Math.PI)];
}

export interface AddressResult {
  street: string;
  houseNumber: string;
  lat: number;
  lon: number;
  label: string;
}

export type ParsedQuery =
  | { type: 'houseNumberOnly'; houseNumber: string }
  | { type: 'streetOnly'; street: string }
  | { type: 'streetAndHouseNumber'; street: string; houseNumber: string };

function normalizeStreet(street: string): string {
  return street.replace(/str\./gi, 'straße');
}

export function parseQuery(query: string): ParsedQuery {
  const tokens = query.trim().split(/\s+/);
  const lastToken = tokens[tokens.length - 1];
  const lastIsNumber = /^\d/.test(lastToken);

  if (tokens.length === 1 && lastIsNumber)
    return { type: 'houseNumberOnly', houseNumber: lastToken };

  if (tokens.length > 1 && lastIsNumber)
    return {
      type: 'streetAndHouseNumber',
      street: normalizeStreet(tokens.slice(0, -1).join(' ')),
      houseNumber: lastToken,
    };

  return { type: 'streetOnly', street: normalizeStreet(tokens.join(' ')) };
}

function queryByHouseNumber(
  db: Database,
  houseNumber: string,
): QueryExecResult[] {
  return db.exec(
    `SELECT s.name, ba.house_number, ba.cx, ba.cy
     FROM streets s JOIN building_addresses ba ON ba.street_id = s.id
     WHERE ba.house_number LIKE ?
     ORDER BY s.name, CAST(ba.house_number AS INTEGER), ba.house_number
     LIMIT ${LIMIT}`,
    [`${houseNumber}%`],
  );
}

function queryByStreetAndHouseNumber(
  db: Database,
  street: string,
  houseNumber: string,
): QueryExecResult[] {
  return db.exec(
    `SELECT s.name, ba.house_number, ba.cx, ba.cy
     FROM streets s JOIN building_addresses ba ON ba.street_id = s.id
     WHERE s.name LIKE ? AND ba.house_number LIKE ?
     ORDER BY CAST(ba.house_number AS INTEGER), ba.house_number
     LIMIT ${LIMIT}`,
    [`%${street}%`, `${houseNumber}%`],
  );
}

function queryByStreet(db: Database, street: string): QueryExecResult[] {
  return db.exec(
    `SELECT s.name, ba.house_number, ba.cx, ba.cy
     FROM streets s JOIN building_addresses ba ON ba.street_id = s.id
     WHERE s.name LIKE ?
     ORDER BY CAST(ba.house_number AS INTEGER), ba.house_number
     LIMIT ${LIMIT}`,
    [`%${street}%`],
  );
}

function rowsToAddressResults(rows: QueryExecResult[]): AddressResult[] {
  if (!rows.length) return [];
  return rows[0].values.map(([street, house, cx, cy]) => {
    const [lat, lon] = utmToWgs84(cx as number, cy as number);
    return {
      street: street as string,
      houseNumber: house as string,
      lat,
      lon,
      label: `${street} ${house}, Regensburg`,
    };
  });
}

function searchAddresses(db: Database, query: string): AddressResult[] {
  const parsed = parseQuery(query);
  if (parsed.type === 'houseNumberOnly')
    return rowsToAddressResults(queryByHouseNumber(db, parsed.houseNumber));
  if (parsed.type === 'streetAndHouseNumber')
    return rowsToAddressResults(
      queryByStreetAndHouseNumber(db, parsed.street, parsed.houseNumber),
    );
  return rowsToAddressResults(queryByStreet(db, parsed.street));
}

export function useAddressSearch(query: string) {
  const {
    data: db,
    isError: isDbError,
    isLoading: isDbLoading,
  } = useQuery({
    queryKey: ['address-db'],
    queryFn: getDb,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 2,
  });

  const search = useQuery<AddressResult[]>({
    queryKey: ['address-search', query],
    queryFn: () => searchAddresses(db!, query),
    enabled: !!db && query.trim().length >= 2,
    staleTime: 0,
  });

  return {
    ...search,
    isError: isDbError || search.isError,
    isDbError,
    isDbLoading,
  };
}
