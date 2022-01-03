import * as React from "react"
import useWebSocket from "react-use-websocket";
import * as styles from "../styles/containers/Spotify.module.css"

const Spotify = ({ wsUrl, Alternative }: { wsUrl: string, Alternative: any }) => {
    const { lastJsonMessage, getWebSocket, sendJsonMessage } = useWebSocket(wsUrl, {
        onOpen: () => sendJsonMessage({GET:1}),
        onMessage: (evt) => {
            console.log(evt.data)
        },
        //Will attempt to reconnect on all close events, such as server shutting down
        shouldReconnect: (closeEvent) => closeEvent.code !== 1000,
    });

    React.useEffect(() => {
        console.log(lastJsonMessage)
    }, [lastJsonMessage])

    if (!lastJsonMessage || lastJsonMessage.playbackState !== "Play") {
        return Alternative;
    }

    return <div className={`container ${styles.container}`}>

    </div>
}

export default Spotify;