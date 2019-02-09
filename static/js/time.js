const times = document.querySelectorAll('.time');

times.forEach((timeEl) => {
    const time = moment.utc(timeEl.textContent);
    time.local();
    timeEl.textContent = time.format('YYYY-MM-DD hh:mm:ss A');
})