import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@uidotdev/usehooks';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { Input } from '../../components/ui/input';

export default function AddressSearch({
  onAddressFound,
}: {
  onAddressFound: (lat: string, lon: string) => void;
}) {
  const [search, setSearch] = useState('');

  const debouncedSearch = useDebounce(search, 500) ?? '';

  const { data = [] } = useQuery({
    queryKey: ['search', debouncedSearch],
    queryFn: async () => {
      if (debouncedSearch === '') return [];

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${debouncedSearch},Regensburg&format=json`,
      );

      const json = await response.json();

      return json as {
        place_id: string;
        licence: string;
        name: string;
        display_name: string;
        lat: string;
        lon: string;
      }[];
    },
  });

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
          onChange={(event) => setSearch(event.target.value)}
          value={search}
          className="py-3"
          placeholder="Adresse suchen in Regensburg..."
          aria-label="Adresse eingeben"
        />
      </form>
      {data.length > 0
        ? data.map((d) => (
            <div
              className="w-full border border-gray-300 bg-white py-2.5 pr-10 pl-9 text-sm shadow-lg outline-offset-2 focus:border-[#D9291C] focus:ring-2 focus:ring-[#D9291C] focus:outline-none md:py-3 md:pr-4 md:pl-10 md:text-base"
              key={d.place_id}
              onClick={() => onAddressFound(d.lat, d.lon)}
            >
              {d.display_name}
            </div>
          ))
        : null}
    </div>
  );
}
