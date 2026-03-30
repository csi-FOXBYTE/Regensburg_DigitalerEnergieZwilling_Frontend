import { produce, type Draft } from 'immer';
import { computed, type ReadableAtom, type WritableAtom } from 'nanostores';

export type FieldStore<TValue> = {
  $store: ReadableAtom;
  setValue: (value: TValue) => void;
};

export default function makeFieldStore<TObject, TValue>(
  store: WritableAtom<TObject>,
  getValue: (obj: TObject) => TValue,
  setValue: (draft: Draft<TObject>, value: TValue) => void,
) {
  const computedStore = computed(store, getValue);

  const mutateField = (value: TValue) => {
    store.set(produce(store.get(), (draft) => setValue(draft, value)));
  };

  return {
    $store: computedStore,
    setValue: mutateField,
  } satisfies FieldStore<TValue>;
}
