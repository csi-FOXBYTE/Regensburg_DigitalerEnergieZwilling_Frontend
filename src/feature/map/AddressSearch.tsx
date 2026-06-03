import { useStore } from '@nanostores/react';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from '@uidotdev/usehooks';
import { Info, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '../../components/ui/input';
import { $building, unselectBuilding } from '../../lib/state/building';

export default function AddressSearch({
  onAddressFound,
}: {
  onAddressFound: (lat: string, lon: string) => void;
}) {
  const building = useStore($building);

  const [search, setSearch] = useState('');
  const [hintDismissed, setHintDismissed] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { t } = useTranslation('map');

  useEffect(() => {
    if (building !== null) setSearch('');
  }, [building]);

  const debouncedSearch = useDebounce(search, 500) ?? '';

  const { data = [] } = useQuery({
    queryKey: ['search', debouncedSearch],
    queryFn: async () => {
      if (debouncedSearch === '') return [];

      const response = await fetch(
        `https://photon.komoot.io/api/?q=${debouncedSearch}&limit=10&lang=de&bbox=11.9,48.95,12.2,49.05`,
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
        aria-label={t('addressSearch.ariaFormLabel')}
        onSubmit={(e) => e.preventDefault()}
      >
        <Input
          type="text"
          leftIcon={<Search />}
          onChange={(event) => {
            if ($building.get() !== null) unselectBuilding();
            setShowSuggestions(true);
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
          placeholder={`${t('addressSearch.placeHolder')}`}
          aria-label={t('addressSearch.ariaInputLabel')}
        />
      </form>
      {!hintDismissed && !building && (
        <div className="mt-2 flex items-start gap-2 border border-[#e30613] bg-white/80 px-3 py-2 text-sm shadow-lg">
          <Info className="mt-0.5 size-4 shrink-0 text-[#e30613]" />
          <p className="flex-1">
            <strong>{t('addressSearch.chooseBuilding')}</strong>{' '}
            {t('addressSearch.infoText')}
          </p>
          <button
            type="button"
            onClick={() => setHintDismissed(true)}
            className="text-[#e30613] hover:text-[#8b2412]"
            aria-label={t('addressSearch.ariaDismissLabel')}
          >
            <X className="size-4" />
          </button>
        </div>
      )}
      {showSuggestions && data.length > 0
        ? data.map((d) => (
            <div
              className="w-full border border-gray-300 bg-white py-2.5 pr-10 pl-9 text-sm shadow-lg outline-offset-2 focus:border-[#D9291C] focus:ring-2 focus:ring-[#D9291C] focus:outline-none md:py-3 md:pr-4 md:pl-10 md:text-base"
              key={`${d.properties.osm_type}${d.properties.osm_id}`}
              onClick={() => {
                setShowSuggestions(false);
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
