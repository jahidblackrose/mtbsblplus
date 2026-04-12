import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

interface SidebarContextType {
  open: boolean;
  collapsed: boolean;
  toggle: () => void;
  close: () => void;
}

const SidebarContext = createContext<SidebarContextType>({ open: false, collapsed: false, toggle: () => {}, close: () => {} });

export function useSidebarState() {
  return useContext(SidebarContext);
}

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false); // mobile overlay
  const [collapsed, setCollapsed] = useState(false); // desktop collapse

  const toggle = useCallback(() => {
    // On mobile (<768) toggle overlay, on desktop toggle collapse
    if (window.innerWidth < 768) {
      setOpen((v) => !v);
    } else {
      setCollapsed((v) => !v);
    }
  }, []);

  const close = useCallback(() => setOpen(false), []);

  return (
    <SidebarContext.Provider value={{ open, collapsed, toggle, close }}>
      {children}
    </SidebarContext.Provider>
  );
}
