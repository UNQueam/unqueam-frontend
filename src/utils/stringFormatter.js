export const  toKebabCase = (inputString) => {
    const kebabCaseString = inputString.replace(/[^\w\s-]/g, "")
        .trim()
        .toLowerCase()
        .replace(/[\s]+/g, "-");

    return kebabCaseString;
}