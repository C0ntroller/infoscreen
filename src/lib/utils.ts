export function dowToString(dow: number) {
    switch (dow) {
        case 0: return "Sonntag";
        case 1: return "Montag";
        case 2: return "Dienstag";
        case 3: return "Mittwoch";
        case 4: return "Donnerstag";
        case 5: return "Freitag";
        case 6: return "Samstag";
        default: return;
    }
}

export function monthToString(month: number) {
    switch (month) {
        case 0: return "Januar";
        case 1: return "Februar";
        case 2: return "März";
        case 3: return "April";
        case 4: return "Mail";
        case 5: return "Juni";
        case 6: return "Juli";
        case 7: return "August";
        case 8: return "September";
        case 9: return "Oktober";
        case 10: return "November";
        case 11: return "Dezember";
        default: return;
    }
}

export function minuteDiff(later: Date, before: Date) {
    return Math.floor((later.getTime() - before.getTime()) / 60000);
}