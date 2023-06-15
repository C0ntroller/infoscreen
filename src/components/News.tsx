import * as React from "react";
import { XMLParser } from "fast-xml-parser";
import * as styles from "../styles/containers/News.module.css"
import type { News as NewsType, PostillonNews } from "../lib/interfaces";

const NEWS_REFRESH_INTERVAL = 15 * 60 * 1000;

const News = () => {
    const [news, setNews] = React.useState<JSX.Element[]>([])

    const processNews = (news: NewsType[], postillon: PostillonNews[]) => {
        const newsTable: JSX.Element[] = []

        let i = 0;
        for (const n of news) {
            if (!n.title || n.title === "") continue;

            const updated = new Date(n["dc:date"]);
            newsTable.push(
                <tr key={++i}>
                    <td>{n.title}</td>
                    <td>{updated.getHours()}:{updated.getMinutes().toString().padStart(2, "0")}</td>
                </tr>
            );
        }

        const toUsePostillon = postillon.filter((news) => !news.categories.includes("Sonntagsfrage") && !news.categories.includes("Newsticker") && !news.categories.includes("Ratgeber") && !news.categories.includes("PamS") && !news.categories.includes("Leserbriefe") && !news.categories.includes("Podcast"));
        toUsePostillon.forEach((n, index) => {
            if (index > 2) return;
            const randTablePos = Math.floor(Math.random() * newsTable.length);
            const updated = new Date(n.pubDate);
            newsTable.splice(randTablePos, 0,
                <tr key={n.title}>
                    <td>{n.title.replace(/&amp;/g, "&").replace(/&quot;/g, "\"")}</td>
                    <td>{updated.getHours()}:{updated.getMinutes().toString().padStart(2, "0")}</td>
                </tr>
            )
        })

        setNews([...newsTable]);
    }

    const pullNews = async () => {
        const xml = new XMLParser();
        const response = await fetch("https://www.tagesschau.de/xml/atom/");
        const feed: { title: string; "dc:date": string; }[] = xml.parse(await response.text()).feed.entry;

        // Feedburner does not allow cors but at least we get JSON
        const postResponse = await fetch("https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Ffeeds.feedburner.com%2Fblogspot%2FrkEL");
        const data = await postResponse.json()

        processNews(feed, data.items);
    }

    React.useEffect(() => {
        pullNews()
        const newsInterval = setInterval(pullNews.bind(this), NEWS_REFRESH_INTERVAL);

        return () => clearInterval(newsInterval);
    }, [])

    return <div className={`container ${styles.container}`}>
        <div className={styles.inner}>
            <table>
                <tbody>
                    {news}
                </tbody>
            </table>
            <table>
                <tbody>
                    {news}
                </tbody>
            </table>
        </div>
    </div>
}

export default News;