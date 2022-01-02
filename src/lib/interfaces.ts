export interface WeatherInfo {
    currently: {
        icon: string;
        temperature: number;
        summary: string;
    },
    daily: {
        data: {
            time: number;  // Epoch without ms
            icon: string;
            temperatureHigh: number;
            temperatureLow: number;
        }[]
    }
}