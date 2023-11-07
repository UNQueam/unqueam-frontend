import Semester from "@/utils/Semester";
import {formatYear} from "@/utils/DateFormatter";

export const formatPeriod = (period) => {
    if (period === undefined || period.year === undefined || period.semester === undefined) return null
    const semester = Semester.getSemester(period.semester)
    const year = formatYear(period.year)
    return {
        semester: semester,
        year: year
    }
}

export const formatToLabel = (period) => {
    const semester = period.semester === 'FIRST' ? 'Primer' : 'Segundo'

    return semester + ' cuatrimestre del año ' + period.year
}