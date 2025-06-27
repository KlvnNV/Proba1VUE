<template>
  <footer
    class="footer"
  >
    <p>&copy; 2025 F1Stat Project. All rights reserved.</p>
  </footer>
</template>

<script>
  export default {
    name: 'AppFooter',
  }
</script>

<style scoped>
.footer {
  background: #2c2c2c;
  color: white;
  text-align: center;
  padding: 1rem;
  position: fixed;
  bottom: 0;
  width: 100%;
}
/* Aдаптация для мобильных устройств (например, iPhone 5) */
@media only screen and (max-width: 640px) {
  .footer {
    width: 100%;
    overflow-x: hidden;
    max-height: 50px !important;
  }
}

/* Планшеты (iPad) */
@media only screen and (min-width: 768px) and (max-width: 1024px) {
  .footer {
    font-size: 14px !important;
  }
}

/* Настольные компьютеры */
@media only screen and (min-width: 1366px) {
  .footer {
    font-size: 16px !important;
  }
}

/* Широкий монитор (Full HD и больше) */
@media only screen and (min-width: 1920px) {
  .footer {
    font-size: 18px !important;
  }
}
</style>
