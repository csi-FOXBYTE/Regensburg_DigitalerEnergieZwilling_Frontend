/**
 * Modul was address db holt
 *
 * schau wie man am besten die queries schreibt
 */
import { useQuery } from '@tanstack/react-query';
import type { Database } from 'sql.js';
import initSqlJs from 'sql.js';

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

export function useAddressSearch(query: string) {
  const { data: db } = useQuery({
    queryKey: ['address-db'],
    queryFn: getDb,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return useQuery<AddressResult[]>({
    queryKey: ['address-search', query],
    queryFn: () => {
      const tokens = query.trim().split(/\s+/);
      const lastToken = tokens[tokens.length - 1];
      const isNumberOnly = tokens.length === 1 && /^\d/.test(lastToken);
      const hasHouseNumber = tokens.length > 1 && /^\d/.test(lastToken);

      let rows;

      if (isNumberOnly) {
        // "12" → all buildings with that house number, across every street
        rows = db!.exec(
          `SELECT s.name, ba.house_number, ba.cx, ba.cy
           FROM streets s JOIN building_addresses ba ON ba.street_id = s.id
           WHERE ba.house_number = ?
           ORDER BY s.name
           LIMIT 10`,
          [lastToken],
        );
      } else if (hasHouseNumber) {
        // "Ludwigstraße 12" → buildings where street name matches AND house number matches
        const streetQ = tokens.slice(0, -1).join(' ');
        rows = db!.exec(
          `SELECT s.name, ba.house_number, ba.cx, ba.cy
           FROM streets s JOIN building_addresses ba ON ba.street_id = s.id
           WHERE s.name LIKE ? AND ba.house_number = ?
           LIMIT 10`,
          [`%${streetQ}%`, lastToken],
        );
      } else {
        // "Ludwigstraße" → 10 buildings on the matching street, sorted by house number
        rows = db!.exec(
          `SELECT s.name, ba.house_number, ba.cx, ba.cy
           FROM streets s JOIN building_addresses ba ON ba.street_id = s.id
           WHERE s.name LIKE ?
           ORDER BY CAST(ba.house_number AS INTEGER)
           LIMIT 10`,
          [`%${tokens.join(' ')}%`],
        );
      }

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
    },
    enabled: !!db && query.trim().length >= 2,
    staleTime: Infinity,
  });
}
