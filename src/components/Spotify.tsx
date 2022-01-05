import * as React from "react"
//import useWebSocket from "react-use-websocket";
import {connect} from "mqtt"
import type { SecretsMQTT } from "../lib/interfaces"
import * as styles from "../styles/containers/Spotify.module.css"

const Spotify = ({ mqtt, Alternative }: { mqtt: SecretsMQTT, Alternative: any }) => {
    const [lastSongInfo, setLastSongInfo] = React.useState<string>("")

    const handleMessage = (_topic: string, message: string) => {
        setLastSongInfo(message.toString())
    }

    React.useEffect(() => {
        const client = connect(mqtt.url, {
            username: mqtt.username,
            password: mqtt.password,
            protocol: "mqtt"
        });

        client.on("message", handleMessage)

        client.on("connect", () => {
            console.log("CONNECTED")
            client.publish("infoscreen/hello", "hello");
            client.subscribe("infoscreen/spotify")
        })

        return () => {client.end()}
    }, [])

    if (true /*!lastJsonMessage || lastJsonMessage.playbackState !== "Play"*/) {
        return Alternative;
    }

    return <div className={`container ${styles.container}`}>

    </div>
}

export default Spotify;