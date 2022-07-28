import * as React from "react"
import { dowToString } from "../lib/utils";
import { Event, SecretsCalendar } from "../lib/interfaces";
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

interface EventList {
    [day: number]: Event[]
}

const Calendar = ({ secrets }: { secrets: SecretsCalendar }) => {
    const [calendarToken, setToken] = React.useState("")
    const [events, setEvents] = React.useState<EventList>({})

    const mergeEvents = (currentList: EventList, toAdd: Event[], ownerIdx: number = 0) => {
        if (!toAdd || toAdd.length === 0) return;
        for(const event of toAdd) {
            const startDate = new Date(event.start.date ? event.start.date : event.start.dateTime)
            const startDateString = startDate.toDateString()

            if(currentList[startDateString] && Array.isArray(currentList[startDateString])) {
                currentList[startDateString].push({ownerIdx, ...event});
                
            } else {
                currentList[startDateString] = [{ownerIdx, ...event}];
            }
        }
        for(const key of Object.keys(currentList)) {
            if(!currentList[key] || !Array.isArray(currentList[key])) {
                delete currentList[key];
            } else {
                (currentList[key] as Event[]).sort((a, b) => {
                    const aStartDate = new Date(a.start.date ? a.start.date : a.start.dateTime);
                    const bStartDate = new Date(b.start.date ? b.start.date : b.start.dateTime);
                    return aStartDate.getTime() - bStartDate.getTime();
                })
            }
        }
    }

    const renderEventTable = () => {
        const eventTable: JSX.Element[] = [];

        // We should probably sort it before using it
        const dateKeyList = Object.keys(events)
        dateKeyList.sort((a, b) => {
            const aDate: Date = new Date(a);
            const bDate: Date = new Date(b);
            return aDate.getTime() - bDate.getTime();
        });

        let i = 0;
        for (const date of dateKeyList) {
            const day: Date = new Date(date);
            const dayDiff = daysDifference(new Date(), day);
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
                <tr key={date}><td colSpan={2} className={styles.calendarDateHeader}>
                    {dowToString(day.getDay())}, {day.getDate()}. {day.getMonth() + 1}
                    <span className={styles.calendarDateHeaderSub}>({dayDiffString})</span>
                </td></tr>
            );

            for(const event of events[date]) {
                const colorClass = styles[`color${event.ownerIdx}`]
                if (event.start.date) {
                    eventTable.push(
                        <tr key={`${date}${i}`} className={`${styles.calendarEntry} ${colorClass}`}><td colSpan={2}>{event.summary}</td></tr>
                    );
                } else {
                    const startTime = new Date(event.start.dateTime)
                    eventTable.push(
                        <tr key={++i} className={`${styles.calendarEntry} ${colorClass}`}>
                            <td>{event.summary}</td>
                            <td className={styles.entryTime}>{startTime.getHours()}:{startTime.getMinutes().toString().padStart(2, "0")}</td>
                        </tr>
                    )
                }
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

    const pullCalendar = async (calendarToken: string, calendarIndex: number = 0) => {
        const correctToken = calendarToken;
        if (!correctToken || correctToken === "") return;

        const timeMin = new Date();
        timeMin.setHours(timeMin.getHours() - 1);
        const params = new URLSearchParams({
            orderBy: "startTime",
            fields: "items(creator,start,summary)",
            singleEvents: "true",
            maxResults: "20",
            timeMin: timeMin.toISOString(),
            key: (secrets.apiKey as string)
        });

        const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${secrets.calendarIds[calendarIndex]}/events?${params.toString()}`, {
            headers: { Authorization: `Bearer ${correctToken}` }
        });
        const events = await response.json();
        return events.items;
        //setEvents([...processEventData(events.items)]);
    }

    const pullAll = async (provToken: string) => {
        const eventList: EventList = {}
        for(let i = 0; i < secrets.calendarIds.length; i++) {
            const events = await pullCalendar(provToken, i);
            mergeEvents(eventList, events, i);
        }
        setEvents(eventList);
    }

    React.useEffect(() => {
        requestToken().then(pullAll)
        const calendarInterval = setInterval(() => {
            setToken(token => {
                pullAll(token);
                return token;
            })
        }, CALENDAR_REFRESH_INTERVAL);
        const calendarTokenInterval = setInterval(requestToken.bind(this), CALENDAR_TOKEN_REFRESH_INTERVAL);

        return () => {
            clearInterval(calendarInterval);
            clearInterval(calendarTokenInterval);
        }
    }, [])

    return <div className={`container ${styles.container}`}>
        <table><tbody>
            {
                renderEventTable()
            }
        </tbody></table>
    </div>

}

export default Calendar;