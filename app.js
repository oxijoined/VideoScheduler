// Обновление текущего времени в 24-часовом формате с датой
function updateCurrentTime() {
    const currentTimeElement = document.getElementById('currentTime');
    const now = new Date();

    // Форматирование даты и времени
    const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    currentTimeElement.innerHTML = now.toLocaleString('ru-RU', options);
}
setInterval(updateCurrentTime, 1000);

// Валидация времени видео
function validateVideoTime(videoTime, videoDuration) {
    const seconds = convertTimeToSeconds(videoTime);
    if (isNaN(seconds) || seconds < 0 || seconds > videoDuration) {
        alert('Неверное время видео!');
        return false;
    }
    return true;
}

// Преобразование времени в секунды
function convertTimeToSeconds(time) {
    const [hours, minutes, seconds] = time.split(':').map(parseFloat);
    return (hours * 3600 + minutes * 60 + seconds) || 0;
}

// Функция для воспроизведения видео
function playVideoAt() {
    const videoPlayer = document.getElementById('videoPlayer');
    const playPromise = videoPlayer.play();

    if (playPromise !== undefined) {
        playPromise.then(_ => {
            // Воспроизведение началось успешно
        }).catch(error => {
            alert('Ошибка воспроизведения видео!');
        });
    }
}

// Запуск обратного отсчета
function startCountdown(duration) {
    const countdownTimer = document.getElementById('countdownTimer');
    let remainingTime = duration;

    const interval = setInterval(function() {
        const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
        const seconds = Math.floor((remainingTime / 1000) % 60);

        countdownTimer.innerHTML = `До начала воспроизведения: ${hours}ч ${minutes}мин ${seconds}сек`;

        remainingTime -= 1000;

        if (remainingTime < 0) {
            clearInterval(interval);
            countdownTimer.innerHTML = 'Видео воспроизводится!';
        }
    }, 1000);
}

// Обработчики событий
document.addEventListener('DOMContentLoaded', function() {
    // Изменение выбранного видеофайла
    document.getElementById('videoFile').addEventListener('change', function(event) {
        const file = event.target.files[0];
        const videoPlayer = document.getElementById('videoPlayer');

        if (file && videoPlayer) {
            const fileURL = URL.createObjectURL(file);
            videoPlayer.src = fileURL;
        } else {
            console.error('Элемент видеоплеера не найден');
        }
    });

    // Нажатие на кнопку "Установить Таймер"
    document.getElementById('setTimerButton').addEventListener('click', function() {
        const videoTime = document.getElementById('videoTime').value;
        const targetDateTime = document.getElementById('targetDateTime').value;

        const videoPlayer = document.getElementById('videoPlayer');
        const videoDuration = videoPlayer.duration;

        if (!validateVideoTime(videoTime, videoDuration)) {
            return; // Прерываем, если время невалидно
        }

        const videoSeconds = convertTimeToSeconds(videoTime);
        const targetTimestamp = new Date(targetDateTime).getTime();
        const currentTimestamp = new Date().getTime();
        const delay = targetTimestamp - currentTimestamp - (videoSeconds * 1000);

        if (delay > 0) {
            setTimeout(() => playVideoAt(), delay);
            startCountdown(delay);
        } else {
            alert('Выбранное время уже прошло!');
        }
    });
});

document.getElementById('fullscreenButton').addEventListener('click', function() {
    var videoPlayer = document.getElementById('videoPlayer');
    if (videoPlayer.requestFullscreen) {
        videoPlayer.requestFullscreen();
    } else if (videoPlayer.mozRequestFullScreen) { /* Firefox */
        videoPlayer.mozRequestFullScreen();
    } else if (videoPlayer.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        videoPlayer.webkitRequestFullscreen();
    } else if (videoPlayer.msRequestFullscreen) { /* IE/Edge */
        videoPlayer.msRequestFullscreen();
    }
});


const currentDateTime = new Date();
const moscowTimeOffset = currentDateTime.getTimezoneOffset() + 360;
const moscowDateTime = new Date(currentDateTime.getTime() + moscowTimeOffset * 60000);
document.getElementById('targetDateTime').value = moscowDateTime.toISOString().slice(0, 16);

