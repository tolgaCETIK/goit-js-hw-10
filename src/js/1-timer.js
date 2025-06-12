// Vite için gerekli import'lar
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

// DOM elemanlarını seç
const dateTimePicker = document.querySelector('#datetime-picker');
const startButton = document.querySelector('[data-start]');
const daysSpan = document.querySelector('[data-days]');
const hoursSpan = document.querySelector('[data-hours]');
const minutesSpan = document.querySelector('[data-minutes]');
const secondsSpan = document.querySelector('[data-seconds]');

// Kullanıcının seçtiği tarihi saklamak için değişken
let userSelectedDate = null;
let countdownInterval = null;

// Flatpickr options
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    
    // Seçilen tarih geçmişte mi kontrol et
    if (selectedDate <= new Date()) {
      // Geçmiş tarih seçildi - uyarı göster ve düğmeyi devre dışı bırak
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight'
      });
      startButton.disabled = true;
      userSelectedDate = null;
    } else {
      // Gelecek tarih seçildi - düğmeyi etkinleştir
      userSelectedDate = selectedDate;
      startButton.disabled = false;
    }
  },
};

// Flatpickr'ı başlat
flatpickr(dateTimePicker, options);

// Start düğmesine tıklama event listener'ı
startButton.addEventListener('click', startCountdown);

function startCountdown() {
  if (!userSelectedDate) return;
  
  // Start düğmesini devre dışı bırak
  startButton.disabled = true;
  
  // Geri sayımı başlat
  countdownInterval = setInterval(() => {
    const currentTime = new Date().getTime();
    const selectedTime = userSelectedDate.getTime();
    const timeDifference = selectedTime - currentTime;
    
    // Zaman doldu mu kontrol et
    if (timeDifference <= 0) {
      clearInterval(countdownInterval);
      updateTimerDisplay({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      return;
    }
    
    // Kalan zamanı hesapla ve göster
    const timeLeft = convertMs(timeDifference);
    updateTimerDisplay(timeLeft);
  }, 1000);
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function updateTimerDisplay({ days, hours, minutes, seconds }) {
  daysSpan.textContent = addLeadingZero(days);
  hoursSpan.textContent = addLeadingZero(hours);
  minutesSpan.textContent = addLeadingZero(minutes);
  secondsSpan.textContent = addLeadingZero(seconds);
}