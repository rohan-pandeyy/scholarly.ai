(function () {
    // Store original window properties to restore/use when extension is inactive
    const originalInnerWidthDescriptor = Object.getOwnPropertyDescriptor(
        window,
        "innerWidth"
    );
    const originalInnerWidthGetter = originalInnerWidthDescriptor
        ? originalInnerWidthDescriptor.get
        : null;

    const originalMatchMedia = window.matchMedia;
    let isScholarlyActive = false;

    // Spoof window.innerWidth to return the reduced width when active
    Object.defineProperty(window, "innerWidth", {
        get: function () {
            if (isScholarlyActive) {
                return document.documentElement.clientWidth;
            }
            return originalInnerWidthGetter
                ? originalInnerWidthGetter.call(window)
                : document.documentElement.clientWidth;
        },
        configurable: true,
    });

    // Spoof window.matchMedia to evaluate queries against the reduced width
    window.matchMedia = function (query: string): MediaQueryList {
        if (!isScholarlyActive) {
            return originalMatchMedia.call(window, query);
        }

        const maxWidthMatch = query.match(/\(max-width:\s*(\d+)px\)/);
        const minWidthMatch = query.match(/\(min-width:\s*(\d+)px\)/);

        // Return a safe stub for unsupported queries
        if (!maxWidthMatch && !minWidthMatch) {
            const stub = {
                matches: false,
                media: query,
                onchange: null as
                    | ((this: MediaQueryList, ev: MediaQueryListEvent) => any)
                    | null,
                addListener: (_fn?: any) => {},
                removeListener: (_fn?: any) => {},
                addEventListener: (_type?: string, _fn?: any) => {},
                removeEventListener: (_type?: string, _fn?: any) => {},
                dispatchEvent: (_ev?: Event) => false,
            };
            return stub as unknown as MediaQueryList;
        }

        // Calculate match state based on current document width
        const limitStr = (maxWidthMatch?.[1] ?? minWidthMatch?.[1]) as string;
        const limit = parseInt(limitStr, 10);
        const isMax = !!maxWidthMatch;

        const calculate = (): boolean => {
            const w = document.documentElement.clientWidth;
            return isMax ? w <= limit : w >= limit;
        };

        let currentMatches = calculate();

        const legacyListeners = new Set<(mql: MediaQueryList) => void>();
        const modernListeners = new Set<(ev: MediaQueryListEvent) => void>();

        let mql: MediaQueryList & {
            __dispose?: () => void;
            onchange?:
                | ((this: MediaQueryList, ev: MediaQueryListEvent) => any)
                | null;
        };

        // Notify all listeners when match state changes
        const createEvent = (matches: boolean): MediaQueryListEvent => {
            return {
                matches,
                media: query,
                type: "change",
            } as MediaQueryListEvent;
        };

        const notify = (): void => {
            const newMatches = calculate();
            if (newMatches === currentMatches) return;
            currentMatches = newMatches;

            const ev = createEvent(newMatches);

            if (mql.onchange) {
                try {
                    mql.onchange(ev);
                } catch {}
            }

            legacyListeners.forEach((cb) => {
                try {
                    cb(mql);
                } catch {}
            });

            modernListeners.forEach((cb) => {
                try {
                    cb(ev);
                } catch {}
            });
        };

        const resizeHandler = (): void => notify();
        window.addEventListener("resize", resizeHandler);

        // Construct the MediaQueryList object with both legacy and modern API support
        const mqlBase = {
            media: query,
            get matches() {
                return currentMatches;
            },
            onchange: null as
                | ((this: MediaQueryList, ev: MediaQueryListEvent) => any)
                | null,

            addListener(fn?: ((mql: MediaQueryList) => void) | null) {
                if (typeof fn === "function")
                    legacyListeners.add(fn as (mql: MediaQueryList) => void);
            },
            removeListener(fn?: ((mql: MediaQueryList) => void) | null) {
                if (typeof fn === "function")
                    legacyListeners.delete(fn as (mql: MediaQueryList) => void);
            },

            addEventListener(
                type: string,
                fn?: ((ev: MediaQueryListEvent) => void) | null
            ) {
                if (type === "change" && typeof fn === "function")
                    modernListeners.add(
                        fn as (ev: MediaQueryListEvent) => void
                    );
            },
            removeEventListener(
                type: string,
                fn?: ((ev: MediaQueryListEvent) => void) | null
            ) {
                if (type === "change" && typeof fn === "function")
                    modernListeners.delete(
                        fn as (ev: MediaQueryListEvent) => void
                    );
            },

            dispatchEvent(ev: Event) {
                if ((ev as any).type !== "change") return false;
                notify();
                return true;
            },

            __dispose() {
                window.removeEventListener("resize", resizeHandler);
                legacyListeners.clear();
                modernListeners.clear();
                (mql as any).onchange = null;
            },
        };

        mql = mqlBase as unknown as MediaQueryList & {
            __dispose?: () => void;
            onchange?:
                | ((this: MediaQueryList, ev: MediaQueryListEvent) => any)
                | null;
        };

        return mql as unknown as MediaQueryList;
    };

    // Listen for extension toggle events to update state and trigger layout recalculation
    window.addEventListener("SCHOLARLY_TOGGLE", (e: any) => {
        isScholarlyActive = e.detail.active;
        window.dispatchEvent(new Event("resize"));
        setTimeout(() => window.dispatchEvent(new Event("resize")), 100);
    });
})();
