import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Clock, ExternalLink } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { fadeUp } from "@/lib/motion";

const RSS_SOURCES = {
  nl: "https://www.nu.nl/rss/tech",
  ar: "https://feeds.bbci.co.uk/arabic/science_and_tech/rss.xml",
  es: "https://feeds.bbci.co.uk/mundo/rss.xml",
  zh: "https://feeds.bbci.co.uk/zhongwen/simp/science-and-tech/rss.xml",
};

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
      className="group rounded-xl bg-card border border-primary/20 p-5 flex flex-col gap-3 hover:bg-primary hover:border-primary transition-colors duration-500 no-underline"
    >
      <p className="text-sm font-medium text-foreground group-hover:text-white leading-snug line-clamp-3 transition-colors duration-500">
        {title}
      </p>
      <div className="flex items-center gap-3 mt-auto text-xs text-muted-foreground group-hover:text-white/70 transition-colors duration-500">
        {meta}
      </div>
    </motion.a>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="rounded-xl bg-card border border-border p-5 animate-pulse h-36" />
      ))}
    </div>
  );
}

export default function TechNewsSection() {
  const { t, lang } = useLanguage();
  const { label, title, subtitle } = t.news;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setData(null);
    setLoading(true);
    (async () => {
      try {
        if (lang === "en") {
          const ids = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json").then(r => r.json());
          const items = await Promise.all(
            ids.slice(0, 6).map(id =>
              fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(r => r.json())
            )
          );
          setData({ type: "hn", items: items.filter(Boolean) });
        } else {
          const rssUrl = RSS_SOURCES[lang];
          if (!rssUrl) return;
          const res = await fetch(
            `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`
          ).then(r => r.json());
          if (res.status === "ok") setData({ type: "rss", items: res.items.slice(0, 6) });
        }
      } catch {}
      finally { setLoading(false); }
    })();
  }, [lang]);

  return (
    <section id="technews" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div {...fadeUp()} className="mb-16">
          <span className="font-mono text-sm text-primary tracking-wider">{label}</span>
          <h2 className="text-4xl md:text-5xl font-bold mt-2 tracking-tight">
            <span className="marker-highlight">{title}</span>
          </h2>
          <p className="text-muted-foreground mt-3 text-sm font-mono">{subtitle}</p>
        </motion.div>

        {loading ? (
          <SkeletonGrid />
        ) : data?.type === "hn" ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.items.map((story, i) => (
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
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.items?.map((item, i) => (
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
    </section>
  );
}
