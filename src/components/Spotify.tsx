import * as React from "react"
//import useWebSocket from "react-use-websocket";
import { connect } from "mqtt"
import FastAverageColor from 'fast-average-color';
import type { SecretsMQTT, SongInfo } from "../lib/interfaces"
import * as styles from "../styles/containers/Spotify.module.css"

const fac = new FastAverageColor();

const Spotify = ({ mqtt, Alternative }: { mqtt: SecretsMQTT, Alternative: any }) => {
    const [lastSongInfo, setLastSongInfo] = React.useState<SongInfo>({
        playbackState: "STOPPED"
    });
    const [color, setColors] = React.useState<{bg?: string; text?: string}>({});

    const handleMessage = (_topic: string, message: string) => {
        try {
            const songInfo: SongInfo = JSON.parse(message.toString());
            setLastSongInfo((lastInfo) => {return {...lastInfo, ...songInfo}});
        } catch {
            console.warn(`Can't parse song info: ${message.toString()}`);
        }
    }

    React.useEffect(() => {
        const client = connect(mqtt.url, {
            username: mqtt.username,
            password: mqtt.password,
            protocol: "ws"
        });

        client.on("message", handleMessage);

        client.on("connect", () => {
            //console.log("CONNECTED")
            client.publish("infoscreen/hello", "hello");
            client.subscribe("infoscreen/spotify")
        })

        return () => { client.end() }
    }, [])

    React.useEffect(() => {
        (async () => {
            if (lastSongInfo.playbackState !== "STOPPED" && lastSongInfo.cover && lastSongInfo.cover.startsWith("http") && document) {
                const { value, isDark } = await fac.getColorAsync(lastSongInfo.cover);
                value[3] = 0.8;
                setColors({
                    bg: `rgba(${value.join(",")})`,
                    text: `var(--textColor${isDark ? "Light" : "Dark"})`
                });
            } else {
                setColors({});
            }
        })();
    }, [lastSongInfo]);

    if (lastSongInfo.playbackState === "STOPPED") {
        return Alternative;
    }

    return <div className={`container ${styles.container}`} style={{
        background: color.bg,
        color: color.text
    }}>
        {lastSongInfo.cover ? <img src={lastSongInfo.cover} alt="Cover" className={styles.cover} /> : <div></div>}
        <div className={styles.meta}>
            <span className={styles.title}>{lastSongInfo.title || "Unbekannt"}</span><br/>
            <span>{lastSongInfo.artist ? lastSongInfo.artist.join(", ") || "Unbekannt" : "Unbekannt"}</span><br/>
            <span>{lastSongInfo.album || "Unbekannt"}</span>
        </div>
        
    </div>
}

export default Spotify;