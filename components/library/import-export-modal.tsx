"use client";

import { useState, useRef } from "react";
import {
  X,
  UploadCloud,
  FileCode,
  Download,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileText,
  Sparkles,
  ArrowRight,
} from "lucide-react";

export interface ParsedXmlEntry {
  title: string;
  domain?: string;
  mediaType?: string;
  status?: string;
  rating?: number | null;
  seasonNumber?: number;
  currentEpisode?: number;
  totalEpisodes?: number;
  favorite?: boolean;
  notes?: string | null;
  overview?: string | null;
  posterPath?: string | null;
  releaseDate?: string | null;
}

interface ImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess?: () => void;
  totalEntriesCount?: number;
}

export function ImportExportModal({
  isOpen,
  onClose,
  onImportSuccess,
  totalEntriesCount = 0,
}: ImportExportModalProps) {
  const [activeTab, setActiveTab] = useState<"import" | "export">("import");
  const [xmlFile, setXmlFile] = useState<File | null>(null);
  const [parsedEntries, setParsedEntries] = useState<ParsedXmlEntry[]>([]);
  const [parseError, setParseError] = useState<string>("");
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [importStatus, setImportStatus] = useState<string>("");
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  function parseXmlContent(text: string) {
    try {
      setParseError("");
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, "text/xml");

      const parserError = xmlDoc.getElementsByTagName("parsererror");
      if (parserError.length > 0) {
        throw new Error("Invalid XML syntax: " + parserError[0].textContent);
      }

      const results: ParsedXmlEntry[] = [];

      // Case 1: WatchVerse / REEL format (<watchverse><entries><entry>...)
      const standardEntries = xmlDoc.getElementsByTagName("entry");
      if (standardEntries.length > 0) {
        for (let i = 0; i < standardEntries.length; i++) {
          const el = standardEntries[i];
          const title = el.getElementsByTagName("title")[0]?.textContent || "";
          if (!title) continue;

          results.push({
            title,
            domain: el.getElementsByTagName("domain")[0]?.textContent || "ANIME",
            mediaType: el.getElementsByTagName("mediaType")[0]?.textContent || "TV",
            status: el.getElementsByTagName("status")[0]?.textContent || "WATCHED",
            rating: el.getElementsByTagName("rating")[0]?.textContent
              ? Number(el.getElementsByTagName("rating")[0]?.textContent)
              : null,
            seasonNumber: Number(el.getElementsByTagName("seasonNumber")[0]?.textContent) || 1,
            currentEpisode: Number(el.getElementsByTagName("currentEpisode")[0]?.textContent) || 0,
            totalEpisodes: Number(el.getElementsByTagName("totalEpisodes")[0]?.textContent) || 12,
            favorite: el.getElementsByTagName("favorite")[0]?.textContent === "true",
            notes: el.getElementsByTagName("notes")[0]?.textContent || null,
            overview: el.getElementsByTagName("overview")[0]?.textContent || null,
            posterPath: el.getElementsByTagName("posterPath")[0]?.textContent || null,
            releaseDate: el.getElementsByTagName("releaseDate")[0]?.textContent || null,
          });
        }
      }

      // Case 2: MyAnimeList (MAL) export XML (<myanimelist><anime>...)
      const malAnime = xmlDoc.getElementsByTagName("anime");
      if (results.length === 0 && malAnime.length > 0) {
        for (let i = 0; i < malAnime.length; i++) {
          const el = malAnime[i];
          const title = el.getElementsByTagName("series_title")[0]?.textContent || "";
          if (!title) continue;

          const malScore = Number(el.getElementsByTagName("my_score")[0]?.textContent);
          const malStatus = el.getElementsByTagName("my_status")[0]?.textContent || "Completed";
          const watchedEps = Number(el.getElementsByTagName("my_watched_episodes")[0]?.textContent) || 0;
          const totalEps = Number(el.getElementsByTagName("series_episodes")[0]?.textContent) || 12;

          let mappedStatus = "WATCHED";
          if (malStatus.toLowerCase().includes("watching") || malStatus === "1") mappedStatus = "WATCHING";
          else if (malStatus.toLowerCase().includes("plan") || malStatus === "6") mappedStatus = "PLAN_TO_WATCH";
          else if (malStatus.toLowerCase().includes("hold") || malStatus === "3") mappedStatus = "ON_HOLD";
          else if (malStatus.toLowerCase().includes("drop") || malStatus === "4") mappedStatus = "DROPPED";

          results.push({
            title,
            domain: "ANIME",
            mediaType: "TV",
            status: mappedStatus,
            rating: malScore > 0 ? malScore : null,
            seasonNumber: 1,
            currentEpisode: watchedEps,
            totalEpisodes: totalEps,
            favorite: malScore >= 9,
            notes: el.getElementsByTagName("my_comments")[0]?.textContent || null,
          });
        }
      }

      if (results.length === 0) {
        setParseError("No valid titles found in the uploaded XML. Make sure tags have <title> or <series_title>.");
        setParsedEntries([]);
        return;
      }

      setParsedEntries(results);
    } catch (err: unknown) {
      setParseError(err instanceof Error ? err.message : "Failed to parse XML file.");
      setParsedEntries([]);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setXmlFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      parseXmlContent(text);
    };
    reader.readAsText(file);
  }

  async function handleLoadSample() {
    try {
      setImportStatus("Loading sample XML file...");
      const res = await fetch("/sample-library.xml");
      if (!res.ok) throw new Error("Could not load sample file");
      const text = await res.text();
      setXmlFile(new File([text], "sample-library.xml", { type: "text/xml" }));
      parseXmlContent(text);
      setImportStatus("Loaded sample XML! Review the entries below and click 'Import'.");
    } catch (e: unknown) {
      setParseError(e instanceof Error ? e.message : "Failed to load sample");
    }
  }

  async function handleConfirmImport() {
    if (parsedEntries.length === 0) return;
    setIsImporting(true);
    setImportStatus("");
    setParseError("");

    try {
      const res = await fetch("/api/library/import-xml", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entries: parsedEntries }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to import entries");
      }

      setImportStatus(`Success! ${data.importedCount} titles added/updated in your library.`);
      if (onImportSuccess) {
        setTimeout(() => {
          onImportSuccess();
          onClose();
        }, 1200);
      }
    } catch (err: unknown) {
      setParseError(err instanceof Error ? err.message : "Error importing titles");
    } finally {
      setIsImporting(false);
    }
  }

  async function handleExportDownload() {
    setIsExporting(true);
    try {
      const res = await fetch("/api/library/export-xml");
      if (!res.ok) throw new Error("Failed to export XML");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reel-library-${new Date().toISOString().split("T")[0]}.xml`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: unknown) {
      alert("Failed to export XML: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#121316] text-[#f5f1e8] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ef4444] text-white">
              <FileCode size={20} />
            </span>
            <div>
              <h2 className="text-lg font-bold text-white">Library Data (XML)</h2>
              <p className="text-xs text-white/50">Import from XML or backup your library</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab selection */}
        <div className="flex border-b border-white/10 px-6 pt-3">
          <button
            onClick={() => setActiveTab("import")}
            className={`flex items-center gap-2 border-b-2 pb-3 px-4 text-xs font-bold uppercase tracking-wider transition ${
              activeTab === "import"
                ? "border-[#ef4444] text-[#ef4444]"
                : "border-transparent text-white/50 hover:text-white"
            }`}
          >
            <UploadCloud size={16} />
            <span>Import XML</span>
          </button>

          <button
            onClick={() => setActiveTab("export")}
            className={`flex items-center gap-2 border-b-2 pb-3 px-4 text-xs font-bold uppercase tracking-wider transition ${
              activeTab === "export"
                ? "border-[#ef4444] text-[#ef4444]"
                : "border-transparent text-white/50 hover:text-white"
            }`}
          >
            <Download size={16} />
            <span>Export XML</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {activeTab === "import" ? (
            <div className="space-y-5">
              {/* File upload drag zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/15 bg-white/[0.02] p-8 text-center cursor-pointer transition hover:border-[#ef4444]/60 hover:bg-[#ef4444]/5"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xml,text/xml"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-[#ef4444] transition group-hover:scale-110">
                  <UploadCloud size={24} />
                </div>
                <p className="mt-3 text-sm font-semibold text-white">
                  {xmlFile ? xmlFile.name : "Click to select or drop an XML file"}
                </p>
                <p className="mt-1 text-xs text-white/40">
                  Supports WatchVerse / REEL XML and MyAnimeList (MAL) export XML
                </p>
              </div>

              {/* Sample loader */}
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
                <div className="flex items-center gap-2.5 text-xs text-white/70">
                  <Sparkles size={15} className="text-[#facc15]" />
                  <span>Don&apos;t have an XML file handy?</span>
                </div>
                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="rounded-lg bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs font-medium text-white transition flex items-center gap-1.5"
                >
                  Load Demo XML
                </button>
              </div>

              {/* Error state */}
              {parseError && (
                <div className="flex items-center gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{parseError}</span>
                </div>
              )}

              {/* Status message */}
              {importStatus && (
                <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-300">
                  <CheckCircle size={16} className="shrink-0" />
                  <span>{importStatus}</span>
                </div>
              )}

              {/* Preview of Parsed Entries */}
              {parsedEntries.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#ef4444]">
                      Detected {parsedEntries.length} Titles
                    </span>
                    <span className="text-xs text-white/40">Ready to save</span>
                  </div>

                  <div className="max-h-48 overflow-y-auto space-y-1.5 rounded-xl border border-white/10 bg-black/30 p-2 scrollbar-thin">
                    {parsedEntries.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2 text-xs"
                      >
                        <div className="truncate max-w-[65%]">
                          <span className="font-semibold text-white">{item.title}</span>
                          <span className="ml-2 text-[10px] text-white/40 uppercase">
                            {item.domain || "ANIME"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.rating && (
                            <span className="rounded bg-[#facc15] px-1.5 py-0.5 text-[10px] font-bold text-black">
                              ★ {item.rating}
                            </span>
                          )}
                          <span className="text-[10px] font-semibold text-[#00e5ff]">
                            {item.status || "WATCHED"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleConfirmImport}
                    disabled={isImporting}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#ef4444] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#ef4444]/25 transition hover:bg-[#dc2626] disabled:opacity-50"
                  >
                    {isImporting ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        <span>Importing into Library...</span>
                      </>
                    ) : (
                      <>
                        <span>Import {parsedEntries.length} Titles Now</span>
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Export tab */
            <div className="space-y-6 text-center py-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ef4444]/10 text-[#ef4444]">
                <FileText size={32} />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">Export Your Watch Universe</h3>
                <p className="mt-2 text-xs text-white/60 max-w-sm mx-auto">
                  Download a full XML archive of all your tracked posters, ratings, episode progress,
                  and notes. Compatible with any XML reader and WatchVerse restore.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 max-w-sm mx-auto">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-white/50">Current Library Titles:</span>
                  <span className="font-bold text-white">{totalEntriesCount} titles</span>
                </div>
                <div className="flex justify-between items-center text-xs mt-2">
                  <span className="text-white/50">Format:</span>
                  <span className="font-bold text-[#ef4444]">Standard XML (.xml)</span>
                </div>
              </div>

              <button
                onClick={handleExportDownload}
                disabled={isExporting}
                className="inline-flex items-center gap-2 rounded-xl bg-[#ef4444] px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#ef4444]/25 transition hover:bg-[#dc2626] disabled:opacity-50"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    <span>Generating XML...</span>
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    <span>Download reel-library.xml</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
