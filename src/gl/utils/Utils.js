function hexToRgb(hex)
{
    const result = (/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i).exec(hex);

    return result ? [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255,
    ] : null;
}
function numberToRgb(hex)
{
    hex = parseInt(hex);
    var hex = Math.floor(hex);

    return hex ? [
        (hex >> 16 & 255) / 255,
        (hex >> 8 & 255) / 255,
        (hex & 255) / 255,
    ] : null;
}

function random(min, max)
{
    return Math.random() * (max - min) + min;
}

function clamp(value, min, max)
{
    return Math.min(Math.max(value, min), max);
}

const range = (value, inMin, inMax, outMin, outMax) =>
    ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;

export default {
    hexToRgb,
    numberToRgb,
    random,
    clamp,
    range,
};
