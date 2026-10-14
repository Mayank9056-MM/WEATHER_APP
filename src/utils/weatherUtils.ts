export const WEATHER_API_KEY='d759137b3bfcbe19e5d4ecd307017490'
export const BASE_URL='https://api.openweathermap.org/data/2.5'

export const getBackgroundImage = (condition: string, icon: string) => {
    const isNight = icon?.includes('n');

    if(isNight){
        if(condition === "clean"){
            return require('../assets/night/clean.jpg')
        }

        return require('../assets/night/rain.jpg')
    }

    switch (condition){
        case "Clear":
            return require('../assets/day/clear.jpg')
        case "Clouds":
            return require('../assets/day/clouds.jpg')
        case "Rain":
            return require('../assets/day/rain.jpg')
        case "Snow":
            return require('../assets/day/snow.jpg')
        case "Thunderstorm":
            return require('../assets/day/thunderstorm.jpg')
        case "Drizzle":
            return require('../assets/day/drizzle.jpg')
        case "Mist":
            return require('../assets/day/mist.jpg')
        case "Haze":
            return require('../assets/day/haze.jpg')
        default:
            return require('../assets/day/clear.jpg')
    }
}

export const getWeatherIcon = (icon: string, condition: string) => {
    const isNight = icon?.includes('n');

    switch (condition){
        case "Clear":
            return isNight ? require('../assets/icons/night/clear.png') : require('../assets/icons/day/clear.png')
        case "Clouds":
            return isNight ? require('../assets/icons/night/clouds.png') : require('../assets/icons/day/clouds.png')
        case "Rain":
            return isNight ? require('../assets/icons/night/rain.png') : require('../assets/icons/day/rain.png')
        case "Snow":
            return isNight ? require('../assets/icons/night/snow.png') : require('../assets/icons/day/snow.png')
        case "Thunderstorm":
            return isNight ? require('../assets/icons/night/thunderstorm.png') : require('../assets/icons/day/thunderstorm.png')
        case "Drizzle":
            return isNight ? require('../assets/icons/night/drizzle.png') : require('../assets/icons/day/drizzle.png')
        case "Mist":
            return isNight ? require('../assets/icons/night/mist.png') : require('../assets/icons/day/mist.png')
        case "Haze":
            return isNight ? require('../assets/icons/night/haze.png') : require('../assets/icons/day/haze.png')
        default:
            return isNight ? require('../assets/icons/night/clear.png') : require('../assets/icons/day/clear.png')
    }
}

export const getWeatherColor = (condition: string, icon: string) => {
    const isNight = icon?.includes('n');

    if(isNight){return "#F1F5F9"}

    switch(condition){
        case "Clear":
            return "#F1F5F9"
        case "Clouds":
            return "#E2E8F0"
        case "Rain":
            return "#CBD5E1"            
        case "Snow":
            return "#F8FAFC"
        case "Thunderstorm":
            return "#4B5563"
        case "Drizzle":
            return "#9CA3AF"
        case "Mist":
            return "#D1D5DB"
        case "Haze":
            return "#E5E7EB"
        default:
            return "#F1F5F9"
    }   
}

export const getWeatherImageUrl = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@4x.png`
}