import * as React from "react"
import secrets from "../../secrets.json"
import WeatherAndTimeContainer from "../components/WeatherAndTime"

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
    <WeatherAndTimeContainer apiKey={secrets.weather.apiKey} coords={secrets.weather.coords}/>
  </main>)
}

export default IndexPage
