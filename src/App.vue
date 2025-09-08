<template>
  <router-view />
</template>

<style>
/* 全局样式 */
.language-selector {
  color: #fff;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif;
  background-color: #fff;
  /* color: #fff; */
}

:root {
  --primary-color: #7c3aed;
  --secondary-color: #3b82f6;
}

html.light-mode {
  --text-color: #0f172a;
  --background-color: #f8fafc;
}

/* 如果需要添加其他全局样式，可以在这里添加 */
</style>