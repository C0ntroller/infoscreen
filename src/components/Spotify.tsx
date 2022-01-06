import * as React from "react"
//import useWebSocket from "react-use-websocket";
import {connect} from "mqtt"
import type { SecretsMQTT, SongInfo } from "../lib/interfaces"
import * as styles from "../styles/containers/Spotify.module.css"

const Spotify = ({ mqtt, Alternative }: { mqtt: SecretsMQTT, Alternative: any }) => {
    const [lastSongInfo, setLastSongInfo] = React.useState<SongInfo|undefined>(undefined)

    const handleMessage = (_topic: string, message: string) => {
        try {
            const songInfo: SongInfo = JSON.parse(message.toString());
            setLastSongInfo(songInfo);
        } catch {
            console.warn(`Can't parse song info: ${message.toString()}`);
        }
    }

    React.useEffect(() => {
        const client = connect(mqtt.url, {
            username: mqtt.username,
            password: mqtt.password,
            protocol: "mqtt"
        });

        client.on("message", handleMessage);

        client.on("connect", () => {
            //console.log("CONNECTED")
            client.publish("infoscreen/hello", "hello");
            client.subscribe("infoscreen/spotify")
        })

        return () => {client.end()}
    }, [])

    if (true || !lastSongInfo || lastSongInfo.playbackState !== "PLAYING") {
        return Alternative;
    }

    return <div className={`container ${styles.container}`}>

    </div>
}

export default Spotify;