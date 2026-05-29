import { useStore } from '@nanostores/react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@uidotdev/usehooks';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Input } from '../../components/ui/input';
import { $building, unselectBuilding } from '../../lib/state/building';

const ADDRESS_DB_URL =
  'https://s3.rg.foxbyte.de/det-rg-main/det-rg-addresses.sqlite';

export default function AddressSearch({
  onAddressFound,
}: {
  onAddressFound: (lat: string, lon: string) => void;
}) {
  const building = useStore($building);

  const [search, setSearch] = useState('');

  useEffect(() => {
    if (building !== null) setSearch('');
  }, [building]);

  const debouncedSearch = useDebounce(search, 500) ?? '';

  const { data = [] } = useQuery({
    queryKey: ['search', debouncedSearch],
    queryFn: async () => {
      if (debouncedSearch === '') return [];

      const response = await fetch(
        `https://photon.komoot.io/api/?q=${debouncedSearch}&limit=20&lang=de`,
      );

      const json = await response.json();
      return (
        json.features as {
          properties: {
            osm_id: number;
            osm_type: string;
            street?: string;
            housenumber?: string;
            postcode?: string;
            city?: string;
          };
          geometry: { coordinates: [number, number] };
        }[]
      ).filter((f) => f.properties.street != null);
    },
  });

  const formatStreet = (p: (typeof data)[number]['properties']) =>
    [p.street, p.housenumber].filter(Boolean).join(' ');

  const formatFullAddress = (p: (typeof data)[number]['properties']) =>
    [formatStreet(p), [p.postcode, p.city].filter(Boolean).join(' ')]
      .filter(Boolean)
      .join(', ');

  return (
    <div className="absolute top-2 right-2 left-2 z-10 max-w-full transition-all duration-300 md:top-4 md:right-4 md:left-4 md:max-w-md">
      <form
        className="relative"
        role="search"
        aria-label="Gebäudeadresse suchen"
        onSubmit={(e) => e.preventDefault()}
      >
        <Input
          type="text"
          leftIcon={<Search />}
          onChange={(event) => {
            if ($building.get() !== null) unselectBuilding();
            setSearch(event.target.value);
          }}
          onClear={() => {
            unselectBuilding();
            setSearch('');
          }}
          value={
            search == ''
              ? building?.properties.address
                ? `${building.properties.address.street}`
                : ''
              : search
          }
          className="py-3"
          placeholder="Adresse suchen in Regensburg..."
          aria-label="Adresse eingeben"
        />
      </form>
      {data.length > 0
        ? data.map((d) => (
            <div
              className="w-full border border-gray-300 bg-white py-2.5 pr-10 pl-9 text-sm shadow-lg outline-offset-2 focus:border-[#D9291C] focus:ring-2 focus:ring-[#D9291C] focus:outline-none md:py-3 md:pr-4 md:pl-10 md:text-base"
              key={`${d.properties.osm_type}${d.properties.osm_id}`}
              onClick={() => {
                const [lon, lat] = d.geometry.coordinates;
                onAddressFound(String(lat), String(lon));
                setSearch(formatStreet(d.properties));
              }}
            >
              {formatFullAddress(d.properties)}
            </div>
          ))
        : null}
    </div>
  );
}
