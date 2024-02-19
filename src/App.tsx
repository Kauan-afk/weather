import axios from "axios"
import { FormEvent, useEffect, useState } from "react"

import { createClient } from 'pexels';

import './style/main.scss'
import { MagicMotion, MagicExit } from "react-magic-motion"

interface weatherProps{
  name: string,
  main:{
    feels_like: string,
    temp: number,
    temp_max: number,
    temp_min: number,
  }
}

interface cityPorps{
  lon: number,
  lat: number,
  name: string
}

interface bgProps{
  photos: [{
    avg_color: string,
    src: {
      landscape: string
    }
  }]
}

function App() {
  const useApi = () => ({
    weather: async(lon: number, lat: number) =>{
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=2be064678e12ba49501d24fa13d7447b`)
      
      return {
        weather: response.data
      }
    },

    getCity: async(city: string) =>{
      const response = await axios.get(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=2be064678e12ba49501d24fa13d7447b`)
      return {
        city: response.data
      }
    },
  })
  
  const client = createClient('S0sUw0VjXyBQGMWj9RBBklxlpwejWXTrvIGtM0XrtWn4YRfUOrkMoB5g');
  const api = useApi()
  const [weather, setWeather] = useState<weatherProps>()
  const [city, setCity] = useState<cityPorps>()
  const [bg, setBg] = useState<bgProps>()
  const [contentBgColor, setContentBgColor] = useState("")
  useEffect(() => {
    async function getWeather(){
      if(city){
        const data = api.weather(city.lon, city.lat)
        setWeather((await data).weather)
        client.photos.search({query: city.name, per_page: 1}).then(photo =>{
          setBg(photo)
          setContentBgColor(hexToRGB(photo.photos[0].avg_color, 0.5))

        })
      }
    }

    getWeather()
  }, [city])

  async function getCity(e: FormEvent){
    e.preventDefault()
    const selectCity = document.getElementById("city") as HTMLSelectElement
    const city = selectCity.value
    const data = api.getCity(city)
    if(data){
      setCity((await data).city[0])
    }
  }

  function hexToRGB(hex: string, alpha: number) {
    var r = parseInt(hex.slice(1, 3), 16),
        g = parseInt(hex.slice(3, 5), 16),
        b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
}


  return(
    <div className="main" id="main" style={{backgroundImage: `url(${bg?.photos[0].src.landscape})`,
                                            backgroundRepeat: "no-repeat",
                                            backgroundSize: "cover"
    }}>

      <MagicMotion>
        <div className="mainContent" style={{backgroundColor: `${contentBgColor}`,
                                             
      }}>
          <div className="divSelect">
            <form onSubmit={getCity}>
              {city? null : <p>Escolha a Cidade:</p>}
              <input type="text" id="city" autoComplete="off"/>
            </form>
            {/*
            <select name="city" id="city" onChange={getCity} defaultValue={"default"}>
              <option value="default" disabled hidden>Escolha a cidade</option>
              <option value="Rio de janeiro">Rio de janeiro</option>
              <option value="São Paulo">São Paulo</option>
              <option value="Salvador">Salvador</option>
              <option value="Brasília ">Brasília </option>
              <option value="Curitiba">Curitiba</option>
              <option value="Maceió">Maceió</option>
              <option value="Manaus">Manaus</option>
              <option value="Recife">Recife</option>
              <option value="Belém">Belém</option>
              <option value="Porto Alegre">Porto Alegre</option>
            </select>
            */}
          </div>
          <MagicExit
          initial={{ opacity: 0 }}
          animate={{opacity: 1,}}
          >
          { 
            weather?
              <div className="contentMain">
                <h2>{weather.name}</h2>
                <div className="temp">
                  <h1>{Math.trunc(weather.main.temp)}°C</h1>
                  <h4>Sensation: {Math.trunc(weather.main.temp_min)}°C</h4>

                  <div>
                    <h4>Min: {Math.trunc(weather.main.temp_min)}°C</h4>
                    <h4>Max: {Math.trunc(weather.main.temp_max)}°C</h4>
                  </div>

                </div>
                
              </div>
            : null
          }
          </MagicExit>

        </div>
      </MagicMotion>
    </div>
  )
}

export default App
