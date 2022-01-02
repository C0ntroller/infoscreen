import * as React from "react"
import { dowToString, monthToString } from "../lib/utils";
import type { SecretsWeather, WeatherInfo } from "../lib/interfaces";
import * as styles from "../styles/containers/WeatherAndTime.module.css";

const WEATHER_REFRESH_INTERVAL = 15 * 60 * 1000;

function getWeatherIcon(icon: string) {
    const ImportedIcon = require(`../images/weather/${icon}.svg`);
    return <ImportedIcon />
}

const WeatherAndTime = ({ secrets }: { secrets: SecretsWeather }) => {
    const [date, setDate] = React.useState(new Date());
    const [weather, setWeather] = React.useState<WeatherInfo>({
        currently: {
            icon: "clear-day",
            temperature: 0,
            summary: "No data loaded"
        },
        daily: {
            data: [
                { icon: "clear-day", time: 0, temperatureHigh: 0, temperatureLow: 0 },
                { icon: "clear-day", time: 0, temperatureHigh: 0, temperatureLow: 0 },
                { icon: "clear-day", time: 0, temperatureHigh: 0, temperatureLow: 0 },
                { icon: "clear-day", time: 0, temperatureHigh: 0, temperatureLow: 0 },
            ]
        }
    });

    React.useEffect(() => {
        const dateInterval = setInterval(() => {
            const date = new Date()
            if (date.getHours() < 7) document.documentElement.setAttribute("data-theme", "night");
            else document.documentElement.setAttribute("data-theme", "day");
            setDate(date);
        }, 1000);

        pullWeather()
        //TODO
        //const weatherInterval = setInterval(pullWeather, WEATHER_REFRESH_INTERVAL);

        return () => {
            clearInterval(dateInterval);
            //clearInterval(weatherInterval);
        }
    }, [])

    const pullWeather = () => {
        fetch(`https://api.pirateweather.net/forecast/${secrets.apiKey}/${secrets.coords}?exclude=minutely,hourly&lang=de&units=ca`)
            .then(resp => resp.json())
            .then(setWeather);
    }

    const time = `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
    const dateString = `${dowToString(date.getDay())}, der ${date.getDate()}. ${monthToString(date.getMonth())} ${date.getFullYear()}`;

    if (weather.currently.summary === "No data loaded") return (<div className={`container ${styles.container}`}>
        <span id={styles.clock}>{time}</span>
        <span id={styles.date}>{dateString}</span>
    </div>);

    return (<div className={`container ${styles.container}`}>
        <span id={styles.clock}>{time}</span>
        <span id={styles.date}>{dateString}</span>
        <div id={styles.weatherIcon}>{getWeatherIcon(weather.currently.icon)}</div>
        <span id={styles.temperature}>{weather.currently.temperature.toFixed(1)}°C</span>
        <span id={styles.currentWeatherInfos}>{weather.currently.summary}</span>
        <table id={styles.futureWeatherInfos}>
            <thead>
                <tr>
                    {(() => {
                        const rslt = []
                        for (let i = 0; i < 4; i++) {
                            const day = new Date((weather.daily.data[i].time * 1000));
                            rslt.push(<th colSpan={2} key={i}>{dowToString(day.getDay())}, {day.getDate()}. {day.getMonth() + 1}.</th>);
                        }
                        return rslt
                    })()}
                </tr>
            </thead>
            <tbody>
                <tr>
                    {(() => {
                        const rslt = []
                        for (let i = 0; i < 4; i++) {
                            const style = i > 0 ? { borderLeft: "1px solid var(--iconColor)" } : {}
                            rslt.push(<td key={`00${i}`} rowSpan={2} style={style}>{getWeatherIcon(weather.daily.data[i].icon)}</td>);
                            rslt.push(<td key={`10${i}`} className={styles.futureWeatherHighTemp}>{weather.daily.data[i].temperatureHigh.toFixed(1)}°C</td>);
                        }
                        return rslt
                    })()}
                </tr>
                <tr>
                    {(() => {
                        const rslt = []
                        for (let i = 0; i < 4; i++) {
                            rslt.push(<td key={i} className={styles.futureWeatherLowTemp}>{weather.daily.data[i].temperatureLow.toFixed(1)}°C</td>);
                        }
                        return rslt
                    })()}
                </tr>
            </tbody>
        </table>
    </div>)
}

export default WeatherAndTime;