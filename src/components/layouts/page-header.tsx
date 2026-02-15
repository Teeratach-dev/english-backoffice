"use client";

import { useEffect } from "react";
import { useHeader } from "@/components/providers/header-provider";

interface PageHeaderProps {
  title: string;
}

export function PageHeader({ title }: PageHeaderProps) {
  const { setHeader } = useHeader();

  useEffect(() => {
    setHeader(title);
  }, [title, setHeader]);

  return null;
}
