class Semester {

    static first() {
        return "FIRST";
    }

    static second() {
        return "SECOND";
    }

    static getSemester(spanishPeriod) {
        if (spanishPeriod === undefined || spanishPeriod.size === 0) return null;

        return (spanishPeriod.toLowerCase() === 'primero')
            ? Semester.first()
            : Semester.second();
    }
}

export default Semester