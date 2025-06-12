// Vite için gerekli import'lar
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

// Form elemanını seç
const form = document.querySelector('.form');

// Form submit event listener'ı ekle
form.addEventListener('submit', handleFormSubmit);

function handleFormSubmit(event) {
  // Form'un varsayılan submit davranışını engelle
  event.preventDefault();
  
  // Form verilerini al
  const formData = new FormData(event.target);
  const delay = Number(formData.get('delay'));
  const state = formData.get('state');
  
  // Promise oluştur
  createPromise({ delay, state })
    .then(delay => {
      // Promise fulfilled olduğunda
      const message = `✅ Fulfilled promise in ${delay}ms`;
      console.log(message);
      
      // iziToast ile başarılı mesaj göster
      iziToast.success({
        title: 'Success',
        message: message,
        position: 'topRight'
      });
    })
    .catch(delay => {
      // Promise rejected olduğunda
      const message = `❌ Rejected promise in ${delay}ms`;
      console.log(message);
      
      // iziToast ile hata mesajı göster
      iziToast.error({
        title: 'Error',
        message: message,
        position: 'topRight'
      });
    });
}

function createPromise({ delay, state }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });
}