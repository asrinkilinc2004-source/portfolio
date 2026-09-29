import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Clock, ExternalLink } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { fadeUp } from "@/lib/motion";

const LANG_SOURCES = {
  nl: [
    { name: "Nu.nl",    url: "https://www.nu.nl/rss/tech" },
    { name: "Tweakers", url: "https://tweakers.net/feeds/mixed.xml" },
    { name: "Bright",   url: "https://bright.nl/rss" },
  ],
  en: [
    { name: "Hacker News", type: "hn" },
    { name: "TechCrunch",  url: "https://techcrunch.com/feed/" },
    { name: "Ars Technica",url: "https://feeds.arstechnica.com/arstechnica/index" },
  ],
  ar: [
    { name: "BBC عربي",  url: "https://feeds.bbci.co.uk/arabic/science_and_tech/rss.xml" },
    { name: "الجزيرة",   url: "https://www.aljazeera.net/rss/technology/" },
    { name: "سكاي نيوز", url: "https://www.skynewsarabia.com/rss.xml" },
  ],
  es: [
    { name: "BBC Mundo",    url: "https://feeds.bbci.co.uk/mundo/rss.xml" },
    { name: "Xataka",       url: "https://www.xataka.com/index.xml" },
    { name: "El País Tech", url: "https://ep00.epimg.net/rss/tecnologia/tecnologia.xml" },
  ],
  zh: [
    { name: "BBC 中文", url: "https://feeds.bbci.co.uk/zhongwen/simp/science-and-tech/rss.xml" },
    { name: "Solidot",  url: "https://www.solidot.org/index.rss" },
    { name: "IT之家",   url: "https://www.ithome.com/rss/" },
  ],
};

async function fetchHN() {
  const ids = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json").then(r => r.json());
  const items = await Promise.all(
    ids.slice(0, 6).map(id =>
      fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(r => r.json())
    )
  );
  return items.filter(Boolean);
}

async function fetchRSS(url) {
  const res = await fetch(
    `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`
  ).then(r => r.json());
  if (res.status === "ok") return res.items.slice(0, 6);
  return [];
}

function timeAgo(unix) {
  const s = Math.floor(Date.now() / 1000 - unix);
  if (s < 3600)  return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}u`;
  return `${Math.floor(s / 86400)}d`;
}

function timeAgoDate(dateStr) {
  const s = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (s < 3600)  return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}u`;
  return `${Math.floor(s / 86400)}d`;
}

function domain(url) {
  try { return new URL(url).hostname.replace("www.", ""); }
  catch { return ""; }
}

function NewsCard({ href, title, meta, i }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      {...fadeUp(i * 0.07)}
      className="group relative z-[12] rounded-xl bg-primary border border-primary p-5 flex flex-col gap-3 hover:bg-white hover:border-white/10 transition-colors duration-300 no-underline"
    >
      <p className="text-sm font-medium text-white group-hover:text-primary leading-snug line-clamp-3 transition-colors duration-300">
        {title}
      </p>
      <div className="flex items-center gap-3 mt-auto text-xs text-white/70 group-hover:text-primary/70 transition-colors duration-300">
        {meta}
      </div>
    </motion.a>
  );
}

function SkeletonRow() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="rounded-xl bg-card border border-border p-5 animate-pulse h-32" />
      ))}
    </div>
  );
}

function SourceSection({ source, items, isLoading, isFirst }) {
  return (
    <div>
      <div className={`flex items-center gap-3 ${isFirst ? "mt-6" : "mt-12"} mb-5`}>
        <span className="font-mono text-xs text-primary tracking-widest uppercase">{source.name}</span>
        <div className="flex-1 h-px bg-primary/20" />
      </div>

      {isLoading ? (
        <SkeletonRow />
      ) : items.length === 0 ? null : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {source.type === "hn"
            ? items.map((story, i) => (
                <NewsCard
                  key={story.id}
                  href={story.url || `https://news.ycombinator.com/item?id=${story.id}`}
                  title={story.title}
                  i={i}
                  meta={
                    <>
                      <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" />{story.score}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{timeAgo(story.time)}</span>
                      <span className="ml-auto flex items-center gap-1 truncate">
                        <span className="truncate">{domain(story.url)}</span>
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </span>
                    </>
                  }
                />
              ))
            : items.map((item, i) => (
                <NewsCard
                  key={item.guid || i}
                  href={item.link}
                  title={item.title}
                  i={i}
                  meta={
                    <>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{timeAgoDate(item.pubDate)}</span>
                      <span className="ml-auto flex items-center gap-1 truncate">
                        <span className="truncate">{domain(item.link)}</span>
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </span>
                    </>
                  }
                />
              ))}
        </div>
      )}
    </div>
  );
}

export default function TechNewsSection() {
  const { t, lang } = useLanguage();
  const { label, title, subtitle } = t.news;
  const [sourceData, setSourceData] = useState({});
  const [loadingMap, setLoadingMap] = useState({});

  useEffect(() => {
    const sources = LANG_SOURCES[lang] || LANG_SOURCES.nl;
    const initial = {};
    sources.forEach(s => { initial[s.name] = true; });
    setSourceData({});
    setLoadingMap(initial);

    sources.forEach(async (source) => {
      try {
        const items = source.type === "hn" ? await fetchHN() : await fetchRSS(source.url);
        setSourceData(prev => ({ ...prev, [source.name]: items }));
      } catch {
        setSourceData(prev => ({ ...prev, [source.name]: [] }));
      } finally {
        setLoadingMap(prev => ({ ...prev, [source.name]: false }));
      }
    });
  }, [lang]);

  const sources = LANG_SOURCES[lang] || LANG_SOURCES.nl;

  return (
    <section id="technews" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div {...fadeUp()} className="mb-2">
          <span className="font-mono text-sm text-primary tracking-wider">{label}</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 tracking-tight">
            <span className="marker-highlight">{title}</span>
          </h2>
          <p className="text-muted-foreground mt-3 text-sm font-mono">{subtitle}</p>
        </motion.div>

        {sources.map((source, i) => (
          <SourceSection
            key={source.name}
            source={source}
            items={sourceData[source.name] || []}
            isLoading={loadingMap[source.name] !== false}
            isFirst={i === 0}
          />
        ))}
      </div>
    </section>
  );
}
