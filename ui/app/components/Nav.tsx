"use client";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
export const Nav = () => {
  const activeSegment = useSelectedLayoutSegment();
  const getDeco = (segment: string | null) => ({
    color: "inherit",
    textDecoration: activeSegment === segment ? "underline" : "none",
  });

  return (
    <div style={{ padding: 20, display: "flex", gap: 20 }}>
      <Link style={getDeco(null)} href="/">
        Documentation
      </Link>
      <Link style={getDeco("formations")} href="/formations">
        Formations
      </Link>
      <Link style={getDeco("etablissements")} href="/etablissements">
        Etablissements
      </Link>
    </div>
  );
};
