export interface SecretsWeather {
    apiKey: string;
    coords: string;
}

export interface SecretsCalendar {
    apiKey: string;
    calendarIds: string[];
    clientId: string;
    clientSecret: string;
    refreshToken: string;
}

export interface SecretsMQTT {
    url: string;
    username: string;
    password: string;
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
    ownerIdx?: number;
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

export interface PlantState {
    brightness: number | "unavailable";
    conductivity: number | "unavailable";
    moisture: number | "unavailable";
    problem: string;
    temperature: number | "unavailable";
    unit_of_measurement_dict: {
        brightness: string;
        conductivity: string;
        moisture: string;
        temperature: string;
    }
}

export type SongInfo = {
    playbackState: "PLAYING" | "PAUSE" | "STOPPED";
    title?: string;
    artist?: string[];
    album?: string;
    cover?: string;
}