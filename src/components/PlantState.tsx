import * as React from "react"
import { PlantState as PlantStateType } from "../lib/interfaces";
import * as styles from "../styles/containers/PlantState.module.css";
import WaterDrops from "../images/weather-icons/svg/wi-raindrops.svg";
import Dust from "../images/weather-icons/svg/wi-dust.svg";

const PLANT_REFRESH_INTERVAL = 15 * 60 * 1000;

const PlantState = ({ hassUrl, token, plants }: { hassUrl: string, token: string, plants: string[] }) => {
    const [plantStates, setPlantStates] = React.useState<Record<string, PlantStateType>>({});

    const pullPlants = async () => {
        const plantStates: Record<string, PlantStateType> = {}

        for (const plant of plants) {
            const response = await fetch(`${hassUrl}/api/states/plant.${plant.toLowerCase()}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            const data = await response.json();
            plantStates[plant] = data.attributes
        }

        setPlantStates(plantStates);
    }

    React.useEffect(() => {
        pullPlants()
        const plantInterval = setInterval(pullPlants.bind(this), PLANT_REFRESH_INTERVAL);

        return () => clearInterval(plantInterval);
    }, [])

    return <div className={`container ${styles.container}`}>
        {Object.keys(plantStates).map((key) => {
            return <div key={key} className={styles.plant}>
                <div>{key}</div>
                <div className={plantStates[key].problem.includes("moisture") ? styles.problem : ""}>
                    <span className={styles.icon}><WaterDrops width="90px"/></span><br />
                    {plantStates[key].moisture === "unavailable" ? "?" : plantStates[key].moisture} {plantStates[key].unit_of_measurement_dict.moisture}
                </div>
                <div className={plantStates[key].problem.includes("conductivity") ? styles.problem : ""}>
                    <span className={styles.icon}><Dust width="90px"/></span><br />
                    {plantStates[key].conductivity === "unavailable" ? "?" : plantStates[key].conductivity} {plantStates[key].unit_of_measurement_dict.conductivity}
                </div>
            </div>
        })}
    </div>
}

export default PlantState;