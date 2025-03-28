export const formatDate = (isoString: string) => {
    const date = new Date(isoString);

    const adjustedDate = new Date(date.getTime() - 3 * 60 * 60 * 1000);

    const days = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"];
    const dayAbbr = days[adjustedDate.getUTCDay()];

    const formattedDate = `${dayAbbr} ${String(adjustedDate.getUTCDate()).padStart(2, "0")}/${String(
        adjustedDate.getUTCMonth() + 1
    ).padStart(2, "0")}/${String(adjustedDate.getUTCFullYear()).slice(-2)}`;

    const hours = adjustedDate.getUTCHours();
    const minutes = adjustedDate.getUTCMinutes();

    if (hours === 0 && minutes === 0) {
        return formattedDate;
    }

    return `${formattedDate} ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} hs`;
};
