---
name: rise-fall-colors
description: Global rise/fall color rule for market-related UI elements in this project.
type: feedback
---
上涨颜色必须使用 `#34C759`，下跌颜色必须使用 `#FF3B30`，这是全局硬规则，必须遵守。

**Why:** 用户明确要求全局统一涨跌色，不能再混用 `#12D18E` / `#FF5A5F` / `#58BD7D` / `#FF6838` 等旧色值。

**How to apply:** 以后在股票、行情、盈亏、涨跌幅、K线、趋势色等相关 UI 中，凡是表达上涨/正值都用 `#34C759`，表达下跌/负值都用 `#FF3B30`；修改现有相关页面时优先按该规则同步清理。