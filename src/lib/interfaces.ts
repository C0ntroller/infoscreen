export interface SecretsWeather {
    apiKey: string;
    coords: string;
}

export interface SecretsCalendar {
    apiKey: string;
    calendarId: string;
    clientId: string;
    clientSecret: string;
    refreshToken: string;
}

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

export interface Event {
    start: { dateTime: string; date?: string; };
    summary: string;
}

export interface News {
    title: string; 
    updated: string;
}

export interface PostillonNews {
    title: string; 
    pubDate: string; 
    categories: string[];
}

export interface Departure {
    Direction: string;
    LineName: string;
    RealTime?: string;
    ScheduledTime: string;
    State?: "Delayed" | "InTime" | "Canceled";
    CancelReasons?: string[];
}