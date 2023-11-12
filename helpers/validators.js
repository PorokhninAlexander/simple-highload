export function isNumber(value) {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

export function isId(value) {
    return isNumber(value) && value > 0 && Number.isInteger(value);
}