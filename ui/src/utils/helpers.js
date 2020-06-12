const HOUR = 60 * 60

export function convertToHour(seconds) {
    return seconds / HOUR
}

export function formatTime(timestamp) {
    const date = new Date(1000 * timestamp)
    const hours = (date.getHours() < 10 ? "0" : "") + date.getHours()
    const minutes = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes()
    return `${hours}:${minutes}`
}
