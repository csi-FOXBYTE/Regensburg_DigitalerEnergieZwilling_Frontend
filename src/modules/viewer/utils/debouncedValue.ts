import { useEffect, useRef, useState } from "react";

export function useDebouncedValue<T>(v: T, debounceMs = 500) {
    const [value, setValue] = useState<T | null>(null);

    let dRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        dRef.current = setTimeout(() => setValue(v), debounceMs);
        return () => {
            if (dRef.current !== null) clearTimeout(dRef.current);
        };
    }, [v]);

    return value;
}