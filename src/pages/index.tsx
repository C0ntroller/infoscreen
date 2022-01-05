import * as React from "react"
import secrets from "../../secrets.json"
import Calendar from "../components/Calendar";
import DVB from "../components/DVB";
import News from "../components/News";
import Spotify from "../components/Spotify";
import PlantState from "../components/PlantState";
import WeatherAndTimeContainer from "../components/WeatherAndTime"
import WeatherRadar from "../components/WeatherRadar";

function importAll(r) {
  return r.keys().map(r);
}

const images = importAll(require.context('../images/bg/', false, /\.(png|jpe?g|svg)$/));

const IndexPage = () => {
  const [currentBg, setCurrentBg] = React.useState(0);

  React.useEffect(() => {
    // This effect is executed onload
    updateBackground()
    const interval = setInterval(() => {
      updateBackground();
    }, 30 * 60 * 1000);

    // Return will be executed onunload
    return () => clearInterval(interval);
  }, [])

  const updateBackground = () => {
    let nextBg = Math.floor(Math.random() * images.length)
    while (nextBg == currentBg) nextBg = Math.floor(Math.random() * images.length)
    setCurrentBg(nextBg)
  }

  return (<main style={{ backgroundImage: `url(${images[currentBg].default})` }}>
    <WeatherAndTimeContainer secrets={secrets.weather} />
    <Calendar secrets={secrets.calendar} />
    <WeatherRadar />
    <News />
    <DVB stopId={secrets.dvb.stopId} />
    <Spotify mqtt={secrets.mqtt} Alternative={<PlantState hassUrl={secrets.hass.url} token={secrets.hass.token} plants={["Chili", "Basilikum"]} />} />
  </main>)
}

export default IndexPage
