import * as React from "react";
import type { Departure } from "../lib/interfaces";
import { minuteDiff } from "../lib/utils";
import * as styles from "../styles/containers/DVB.module.css";

const DVB_REFRESH_INTERVAL = 30 * 1000

const DVB = ({ stopId }: { stopId: number }) => {
    const [departuresHead, setDeparturesHead] = React.useState("")
    const [departuresTable, setDeparturesTable] = React.useState<JSX.Element[]>([])

    const processDepatures = (departures: Departure[]) => {
        const depTable: JSX.Element[] = [];

        departures.forEach((departure, index) => {
            const realTime = departure.RealTime ? new Date(parseInt(departure.RealTime.replace(/\/Date\(/g, "").replace(/\-.*$/g, ""))) : undefined;
            const scheduledTime = new Date(parseInt(departure.ScheduledTime.replace(/\/Date\(/g, "").replace(/\-.*$/g, "")));
            const timeToDisplay = realTime || scheduledTime;
            const timeDelay = realTime ? minuteDiff(realTime, scheduledTime) : 0;

            depTable.push(
                <tr className={styles.departure} key={index}>
                    <td>{departure.LineName}</td>
                    <td>{departure.Direction}</td>
                    <td>{timeToDisplay.getHours()}:{timeToDisplay.getMinutes().toString().padStart(2, "0")}</td>
                    <td>{minuteDiff(timeToDisplay, new Date())}</td>
                    <td className={timeDelay < 0 ? styles.beforeTime : styles.delay}>{timeDelay > 0 ? "+" : ""}{timeDelay !== 0 ? timeDelay : false}</td>
                </tr>
            );
        });

        setDeparturesTable([...depTable]);
    }

    const pullDepartures = async () => {
        const time = new Date();
        time.setMinutes(time.getMinutes() + 5)
        const response = await fetch("https://webapi.vvo-online.de/dm", {
            method: "POST",
            body: JSON.stringify({
                stopid: stopId,
                limit: 5,
                time: time.toUTCString()
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        const data = await response.json();
        if (data.Name !== departuresHead) setDeparturesHead(data.Name);
        //console.log(data)
        processDepatures(data.Departures);
    }

    React.useEffect(() => {
        pullDepartures();
        const dvbInterval = setInterval(pullDepartures, DVB_REFRESH_INTERVAL);

        return () => clearInterval(dvbInterval);
    }, [])

    return (<div className={`container ${styles.container}`}>
        <table>
            <tbody>
                {departuresTable}
            </tbody>
        </table>
    </div>)
}

export default DVB;