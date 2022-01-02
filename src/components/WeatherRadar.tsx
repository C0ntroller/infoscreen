import * as React from "react";
import sleep from "../images/sleep.gif";
import * as styles from "../styles/containers/WeatherRadar.module.css";

const RADAR_REFRESH_INTERVAL = 15 * 60 * 1000;

const WeatherRadar = () => {
    const [radarLink, setRadarLink] = React.useState("https://www.dwd.de/DWD/wetter/radar/radfilm_sac_akt.gif");

    React.useEffect(() => {
        const radarInterval = setInterval(() => {
            setRadarLink(`https://www.dwd.de/DWD/wetter/radar/radfilm_sac_akt.gif?r=${Date.now()}`)
        }, RADAR_REFRESH_INTERVAL);

        return () => clearInterval(radarInterval);
    }, [])

    return (
        <div className={`container ${styles.container}`}>
            <img className={`radar ${styles.radar}`} src={radarLink} />
            <img className={`radarNight ${styles.radarNight}`} src={sleep} />
        </div>
    )
}

export default WeatherRadar;