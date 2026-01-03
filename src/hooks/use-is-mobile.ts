"use client";

import { useLayoutEffect, useState } from "react";

export function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);

    useLayoutEffect(() => {
        const updateSize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener("resize", updateSize);
        updateSize();
        return () => window.removeEventListener("resize", updateSize);
    }, []);

    return isMobile;
}
