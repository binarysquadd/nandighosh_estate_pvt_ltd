// app/projects/[id]/loading.tsx
"use client";

import { useEffect, useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";

export default function Loading() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // 👇 Stay for at least 600ms
    const timer = setTimeout(() => setVisible(false), 600);
    return () => clearTimeout(timer);
  }, []);

  return visible ? <LoadingScreen /> : null;
}