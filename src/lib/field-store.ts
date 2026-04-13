import { produce, type Draft } from 'immer';
import {
  atom,
  computed,
  type ReadableAtom,
  type WritableAtom,
} from 'nanostores';

export type FieldStore<TValue> = {
  $store: ReadableAtom<TValue>;
  $placeholder: ReadableAtom<TValue>;
  setValue: (value: TValue) => void;
  resettable: boolean;
};

type PlaceholderWithStore<TPlaceholder, TValue> = {
  placeholderStore: ReadableAtom<TPlaceholder>;
  getPlaceholder: (value: TPlaceholder) => TValue;
};

type PlaceholderWithoutStore<TValue> = {
  getPlaceholder: () => TValue;
};

type FieldStoreOptions<TObject, TValue, TPlaceholder> = {
  store: WritableAtom<TObject>;
  getValue: (obj: TObject) => TValue;
  setValue: (draft: Draft<TObject>, value: TValue) => void;
  resettable?: boolean;
} & (
  | PlaceholderWithStore<TPlaceholder, TValue>
  | PlaceholderWithoutStore<TValue>
  | object
);

export default function makeFieldStore<TObject, TValue, TPlaceholder>(
  options: FieldStoreOptions<TObject, TValue, TPlaceholder>,
) {
  const computedStore = computed(options.store, options.getValue);

  const mutateField = (value: TValue) => {
    options.store.set(
      produce(options.store.get(), (draft) => options.setValue(draft, value)),
    );
  };

  let $placeholder: ReadableAtom<TValue>;
  if ('placeholderStore' in options) {
    $placeholder = computed(options.placeholderStore, options.getPlaceholder);
  } else if ('getPlaceholder' in options) {
    $placeholder = computed(options.store, () => options.getPlaceholder());
  } else {
    $placeholder = atom(undefined);
  }

  return {
    $store: computedStore,
    $placeholder,
    setValue: mutateField,
    resettable: options.resettable ?? false,
  } satisfies FieldStore<TValue>;
}
