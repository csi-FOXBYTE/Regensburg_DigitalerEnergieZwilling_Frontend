import { useStore } from '@nanostores/react';
import { useDebounce } from '@uidotdev/usehooks';
import { Command } from 'cmdk';
import { Info, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAddressSearch } from '../../lib/addressDb';
import { $building, unselectBuilding } from '../../lib/state/building';

export default function AddressSearch({
  onAddressFound,
}: {
  onAddressFound: (
    lat: string,
    lon: string,
    address: { street?: string; housenumber?: string },
  ) => void;
}) {
  const building = useStore($building);
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [hintDismissed, setHintDismissed] = useState(false);
  const { t } = useTranslation('map');

  useEffect(() => {
    if (building !== null) setSearch('');
  }, [building]);

  const debouncedSearch = useDebounce(search, 500) ?? '';
  const { data = [] } = useAddressSearch(debouncedSearch);

  const inputValue =
    search === '' ? (building?.properties.address?.street ?? '') : search;

  const showList = open && search.length >= 2 && data.length > 0;

  return (
    <div className="absolute top-2 right-24 left-2 z-10 max-w-full transition-all duration-300 md:top-4 md:right-4 md:left-4 md:max-w-md">
      <Command
        shouldFilter={false}
        aria-label={t('addressSearch.ariaFormLabel')}
      >
        <div className="relative flex items-center border border-gray-300 bg-white shadow-lg">
          <Search className="absolute left-3 size-4 shrink-0 text-gray-400" />
          <Command.Input
            value={inputValue}
            onValueChange={(val) => {
              if ($building.get() !== null) unselectBuilding();
              setSearch(val);
              setOpen(true);
            }}
            placeholder={t('addressSearch.placeHolder')}
            aria-label={t('addressSearch.ariaInputLabel')}
            className="w-full py-2 pr-9 pl-9 text-sm outline-none md:py-3 md:text-base"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                unselectBuilding();
                setSearch('');
                setOpen(false);
              }}
              className="absolute right-3 text-gray-400 hover:text-gray-600"
              aria-label={t('addressSearch.ariaDismissLabel')}
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {showList && (
          <Command.List className="border border-t-0 border-gray-300 bg-white shadow-lg">
            {data.map((d) => (
              <Command.Item
                key={`${d.street}-${d.houseNumber}`}
                value={d.label}
                onSelect={() => {
                  onAddressFound(String(d.lat), String(d.lon), {
                    street: d.street,
                    housenumber: d.houseNumber,
                  });
                  setSearch(`${d.street} ${d.houseNumber}`);
                  setOpen(false);
                }}
                className="cursor-pointer py-2.5 pr-4 pl-9 text-sm aria-selected:bg-gray-100 md:py-3 md:text-base"
              >
                {d.label}
              </Command.Item>
            ))}
          </Command.List>
        )}
      </Command>

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
    </div>
  );
}
