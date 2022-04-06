import * as React from "react"
import { dowToString } from "../lib/utils";
import type { Event, SecretsCalendar } from "../lib/interfaces";
import * as styles from "../styles/containers/Calendar.module.css"

const CALENDAR_REFRESH_INTERVAL = 15 * 60 * 1000;
const CALENDAR_TOKEN_REFRESH_INTERVAL = 45 * 60 * 1000;

function daysDifference(date1: Date, date2: Date) {
    if (date1.getTime() > date2.getTime()) {
        let tmp = date2;
        date2 = date1;
        date1 = tmp;
    }
    date1 = new Date(date1);
    date1.setHours(0);
    date1.setMinutes(0);
    date2 = new Date(date2);
    date2.setHours(0);
    date2.setMinutes(0);
    return Math.ceil((date2.getTime() - date1.getTime()) / 1000 / 60 / 60 / 24);
}

const Calendar = ({ secrets }: { secrets: SecretsCalendar }) => {
    const [token, setToken] = React.useState("")
    const [events, setEvents] = React.useState([])

    const processEventData = (events: Event[]) => {
        const eventTable = [];
        let lastDate = "";
        let i = 0;
        for (const event of events) {
            const startDate = new Date(event.start.date ? event.start.date : event.start.dateTime)
            const startDateString = `${startDate.getFullYear()}${startDate.getMonth()}${startDate.getDate()}`
            if (startDateString !== lastDate) {
                lastDate = startDateString;
                const dayDiff = daysDifference(new Date(), startDate);
                let dayDiffString: string;
                switch (dayDiff) {
                    case 0: dayDiffString = "Heute"
                        break;
                    case 1: dayDiffString = "Morgen"
                        break;
                    default: dayDiffString = `${dayDiff} Tage`;
                        break;
                }
                eventTable.push(
                    <tr key={startDateString}><td colSpan={2} className={styles.calendarDateHeader}>
                        {dowToString(startDate.getDay())}, {startDate.getDate()}. {startDate.getMonth() + 1}
                        <span className={styles.calendarDateHeaderSub}>({dayDiffString})</span>
                    </td></tr>
                );
            }

            if (event.start.date) {
                eventTable.push(
                    <tr key={++i} className={styles.calendarEntry}><td colSpan={2}>{event.summary}</td></tr>
                );
            } else {
                eventTable.push(
                    <tr key={++i} className={styles.calendarEntry}>
                        <td>{event.summary}</td>
                        <td className={styles.entryTime}>{startDate.getHours()}:{startDate.getMinutes().toString().padStart(2, "0")}</td>
                    </tr>
                )
            }
        }
        return eventTable;
    }

    const requestToken = async () => {
        const response = await fetch("https://accounts.google.com/o/oauth2/token", {
            method: "POST",
            body: JSON.stringify({
                grant_type: "refresh_token",
                refresh_token: secrets.refreshToken,
                client_id: secrets.clientId,
                clientSecret: secrets.clientSecret
            })
        });
        const token = await response.json();
        setToken(token.access_token);
        return token.access_token;
    }

    const pullCalendar = async (provToken: string) => {
        const correctToken = provToken || token;
        if (!correctToken || correctToken === "") return;

        const timeMin = new Date();
        timeMin.setHours(timeMin.getHours() - 1);
        const params = new URLSearchParams({
            orderBy: "startTime",
            fields: "items(creator,start,summary)",
            singleEvents: "true",
            maxResults: "10",
            timeMin: timeMin.toISOString(),
            key: (secrets.apiKey as string)
        });

        const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${secrets.calendarId}/events?${params.toString()}`, {
            headers: { Authorization: `Bearer ${correctToken}` }
        });
        const events = await response.json();
        setEvents([...processEventData(events.items)]);
    }

    React.useEffect(() => {
        requestToken().then(pullCalendar)
        const calendarInterval = setInterval(pullCalendar, CALENDAR_REFRESH_INTERVAL);
        const calendarTokenInterval = setInterval(requestToken, CALENDAR_TOKEN_REFRESH_INTERVAL);

        return () => {
            clearInterval(calendarInterval);
            clearInterval(calendarTokenInterval);
        }
    }, [])

    return <div className={`container ${styles.container}`}>
        <table><tbody>
            {events}
        </tbody></table>
    </div>

}

export default Calendar;