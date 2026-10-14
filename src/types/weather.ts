export interface WeatherData {
    name: string;
    sys: {
        country: string;
        sunrise: number;
        sunset: number;
    };
    main: {
        temp: number;
        feels_like: number;
        humidity: number;
        pressure: number;
    };
    weather: {
        id: number;
        main: string;
        description: string;
        icon: string;
    }[];
    wind: {
        speed: number;
        deg: number;
    };
    dt: number;
}

export interface ForecastData {
    main: {
        feel_lik: number;
    };
    weather: {
        main: string;
        icon: string;
    }[];
}

export interface AQIData {
    main: {
        aqi: number;
    };
    components: {
        [key: string]: number;
    };
}