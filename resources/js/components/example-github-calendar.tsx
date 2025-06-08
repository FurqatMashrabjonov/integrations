import { ActivityCalendar } from 'react-activity-calendar'

const data = [
    {
        date: '2024-07-23',
        count: 2,
        level: 1,
    },
    {
        date: '2024-11-02',
        count: 16,
        level: 4,
    },
    {
        date: '2024-11-29',
        count: 11,
        level: 3,
    },
]

/*
Doc: https://grubersjoe.github.io/react-activity-calendar/?path=/story/react-activity-calendar--activity-levels
 */
export function ExampleGithubCalendar() {
    return <ActivityCalendar data={data} />
}
