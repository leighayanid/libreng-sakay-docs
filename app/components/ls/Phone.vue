<script setup lang="ts">
// A phone frame drawn in CSS around a screenshot.
defineProps<{
  src: string
  alt: string
  eager?: boolean
}>()
</script>

<template>
  <div class="ls-phone">
    <span class="ls-phone__btn ls-phone__btn--a" />
    <span class="ls-phone__btn ls-phone__btn--b" />
    <div class="ls-phone__screen">
      <img
        :src="src"
        :alt="alt"
        :loading="eager ? 'eager' : 'lazy'"
        draggable="false"
      >
      <span class="ls-phone__island" />
      <span class="ls-phone__gloss" />
    </div>
  </div>
</template>

<style scoped>
.ls-phone {
  position: relative;
  aspect-ratio: 540 / 1170;
  padding: 7px;
  border-radius: 2.6rem;
  background: linear-gradient(145deg, #3a4356, #0b1220 40%, #1c2433 70%, #4b5568);
  box-shadow:
    0 0 0 1px rgb(255 255 255 / 0.08) inset,
    0 50px 80px -30px rgb(2 6 23 / 0.55),
    0 30px 40px -30px rgb(2 6 23 / 0.5);
}

.ls-phone__screen {
  position: relative;
  height: 100%;
  overflow: hidden;
  border-radius: 2.15rem;
  background: #0b1220;
}

.ls-phone__screen img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  user-select: none;
}

.ls-phone__island {
  position: absolute;
  top: 9px;
  left: 50%;
  width: 30%;
  height: 16px;
  transform: translateX(-50%);
  border-radius: 999px;
  background: #05080f;
}

.ls-phone__gloss {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(120deg, rgb(255 255 255 / 0.18) 0%, rgb(255 255 255 / 0) 32%, rgb(255 255 255 / 0) 70%, rgb(255 255 255 / 0.06) 100%);
}

.ls-phone__btn {
  position: absolute;
  right: -2px;
  width: 3px;
  border-radius: 0 3px 3px 0;
  background: #2b3445;
}

.ls-phone__btn--a { top: 22%; height: 9%; }
.ls-phone__btn--b { top: 34%; height: 14%; }
</style>
