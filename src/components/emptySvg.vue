<template>
    <svg class="empty-icon" width="160" height="160" viewBox="0 0 160 160" fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <defs>
            <!-- 主渐变 -->
            <linearGradient id="brand-grad" x1="0" y1="0" x2="160" y2="160" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stop-color="#7EA4FF" />
                <stop offset="100%" stop-color="#B4C9FF" />
            </linearGradient>
            <!-- 光晕 -->
            <radialGradient id="halo" cx="0.5" cy="0.45" r="0.45">
                <stop offset="0%" stop-color="#7EA4FF" stop-opacity="0.28" />
                <stop offset="60%" stop-color="#7EA4FF" stop-opacity="0.12" />
                <stop offset="100%" stop-color="#7EA4FF" stop-opacity="0" />
            </radialGradient>
            <!-- 卡片阴影 -->
            <filter id="card-shadow" x="-10" y="-4" width="180" height="180">
                <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#5D84E8" flood-opacity="0.2" />
            </filter>
        </defs>

        <!-- 背景光晕 -->
        <circle class="halo" cx="80" cy="72" r="60" fill="url(#halo)" />

        <!-- 底部阴影椭圆 -->
        <ellipse class="floor-shadow" cx="80" cy="130" rx="36" ry="5" fill="#5D84E8" opacity="0.15" />

        <!-- 主卡片 -->
        <g class="card-group" filter="url(#card-shadow)">
            <!-- 卡片背景 -->
            <rect class="card" x="36" y="36" width="88" height="76" rx="14" fill="white" stroke="#E2E8F0"
                stroke-width="0.5" />
            <!-- 顶部渐变条 -->
            <rect x="36" y="36" width="88" height="6" rx="2" fill="url(#brand-grad)" />

            <!-- 三条横线（列表占位） -->
            <rect class="line line-1" x="52" y="56" width="40" height="5" rx="2.5" fill="#DCE7FF" />
            <rect class="line line-2" x="52" y="68" width="56" height="5" rx="2.5" fill="#EAF0FF" />
            <rect class="line line-3" x="52" y="80" width="32" height="5" rx="2.5" fill="#EAF0FF" />

            <!-- 右侧渐变圆点装饰 -->
            <circle cx="104" cy="58" r="3.5" fill="#7EA4FF" opacity="0.45" />
            <circle cx="104" cy="70" r="3.5" fill="#7EA4FF" opacity="0.3" />
            <circle cx="104" cy="82" r="3.5" fill="#7EA4FF" opacity="0.18" />

            <!-- 底部虚线分隔 -->
            <line x1="48" y1="94" x2="112" y2="94" stroke="#DCE7FF" stroke-width="1.5" stroke-dasharray="4 3" />

            <!-- 底部空状态文字区域 -->
            <rect x="62" y="100" width="36" height="4" rx="2" fill="#CBD5E1" />
        </g>

        <!-- 浮动光粒子 -->
        <circle class="particle p-1" cx="26" cy="50" r="2.5" fill="#7EA4FF" opacity="0.45" />
        <circle class="particle p-2" cx="134" cy="46" r="3" fill="#5D84E8" opacity="0.35" />
        <circle class="particle p-3" cx="22" cy="90" r="2" fill="#7EA4FF" opacity="0.35" />
        <circle class="particle p-4" cx="138" cy="88" r="2" fill="#5D84E8" opacity="0.3" />
        <circle class="particle p-5" cx="46" cy="124" r="2.5" fill="#7EA4FF" opacity="0.25" />
        <circle class="particle p-6" cx="114" cy="122" r="2.5" fill="#5D84E8" opacity="0.2" />

    </svg>
</template>