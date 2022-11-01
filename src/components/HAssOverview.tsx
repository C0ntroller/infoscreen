import * as React from "react"
import { HAssStates } from "../lib/interfaces";
import * as styles from "../styles/containers/HomeAssistant.module.css";

const HASS_REFRESH_INTERVAL = 5 * 60 * 1000;

const HomeAssistant = ({ hassUrl, token }: { hassUrl: string, token: string }) => {
    const [states, setStates] = React.useState<HAssStates>({
        daniel: false,
        vicki: false,
        nextbikes: 0
    });
    
    const fetchState = async (entityId: string) => {
        const response = await fetch(`${hassUrl}/api/states/${entityId}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });
        return await response.json();
    }

    const pullStates = async () => {
        const daniel = await fetchState("person.daniel")
        const vicki = await fetchState("person.vicki")
        const nextbikes = await fetchState("sensor.nextbikes")

        const location = (l: string|undefined) => { switch (l) {
                case "home": return "Zuhause";
                case "not_home": return "Unterwegs";
                case undefined: 
                case "unknown": return "Unbekannt";
                default: return l;
            }
        }

        setStates({
            daniel: location(daniel?.state),
            vicki: location(vicki?.state),
            nextbikes: nextbikes?.state
        });
    }

    React.useEffect(() => {
        pullStates()
        const statesInterval = setInterval(pullStates.bind(this), HASS_REFRESH_INTERVAL);

        return () => clearInterval(statesInterval);
    }, [])

    return <div className={`container ${styles.container}`}>
        <span>Daniel: {states.daniel}</span>
        <span>Vicki: {states.vicki}</span>
        <span>NextBikes: {states.nextbikes}</span>
    </div>
}

export default HomeAssistant;