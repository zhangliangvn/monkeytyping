# 🐒 Khỉ Tập Gõ — Monkey Typing

Game dạy **gõ bàn phím 10 ngón** cho trẻ em, bằng **Tiếng Việt + English**. Điểm khác biệt
lớn nhất so với các game khác: **dạy ngón nào đặt phím nào** — bàn phím ảo tô màu theo ngón,
hai bàn tay khỉ chỉ đúng ngón cần dùng, và luôn nhắc về **hàng phím cơ sở** (ASDF JKL;).

> A polished 10‑finger touch‑typing game for kids (Vietnamese + English). Its headline feature —
> which most typing games lack — is **explicit finger‑placement guidance**: a color‑coded on‑screen
> keyboard, monkey paws that reach the correct key, and home‑row anchoring.

---

## ▶️ Chạy thử trên máy (Run locally)

Cần **Node.js 18+**. Mở terminal trong thư mục này:

```bash
npm install      # cài thư viện (chỉ lần đầu)
npm run dev      # chạy ở http://localhost:5173
```

Mở trình duyệt vào địa chỉ hiện ra rồi **gõ theo chữ trên màn hình**.
- **Tab**: đổi giữa chế độ 🔤 ABC và 📝 Từ.
- **Esc**: quay về menu. Phím **← → ↑ ↓ Enter** để chọn trong menu.

## 🏗️ Đóng gói (Build)

```bash
npm run build    # tạo thư mục dist/ (web tĩnh, ~40KB)
npm run preview  # xem thử bản đã build
```

## 🌐 Đưa lên web cho con chơi (Deploy)

Sau khi `npm run build`, thư mục **`dist/`** là toàn bộ trang web tĩnh. Chọn 1 cách:

- **Netlify (dễ nhất)**: vào https://app.netlify.com/drop và **kéo–thả thư mục `dist/`** vào. Xong, có ngay link.
- **Vercel**: `npm i -g vercel` rồi `vercel` (hoặc kéo‑thả `dist/` trên dashboard).
- **GitHub Pages**: đẩy code lên GitHub, bật Pages cho nhánh, build và trỏ tới `dist/`.
  (Dự án đã đặt `base: './'` nên chạy được ở mọi đường dẫn con.)

Game **chỉ chạy phía trình duyệt**, không cần máy chủ — copy `dist/` đi đâu cũng chơi được,
kể cả mở `dist/index.html` ngoại tuyến.

> ⚠️ Game cần **bàn phím thật** (laptop/PC), không hợp điện thoại.

---

## ✨ Tự thêm nội dung (Extend it yourself)

Mọi nội dung là **dữ liệu**, nằm trong [`src/content/`](src/content/). Thêm thứ mới = sửa 1 file,
không phải đụng vào "máy game".

- **Thêm nhân vật** → [`src/content/characters.ts`](src/content/characters.ts): copy một mục, đổi
  `id`, tên, `ability`, màu, `unlockCostBananas` (giá chuối), `world` (cảnh), và `emoji`.
- **Thêm/sửa cảnh** → [`src/content/scenes.ts`](src/content/scenes.ts).
- **Thêm/sửa level & bộ từ** → [`src/content/levels.ts`](src/content/levels.ts). Từ trong level chỉ
  nên dùng các phím đã dạy (có bài test tự kiểm tra điều này).
- **Sửa chữ hiển thị (Việt/Anh)** → [`src/i18n/strings.ts`](src/i18n/strings.ts).
- **Đổi màu ngón / phím** → [`src/content/fingerMap.ts`](src/content/fingerMap.ts).

Sau khi sửa, chạy `npm test` để chắc chắn không vỡ gì, rồi `npm run build` lại.

> 🎨 Hiện nhân vật vẽ bằng code (emoji + hình khối). Đã chừa sẵn chỗ để sau này gắn **ảnh bạn tự vẽ**
> (xem `art` trong mô hình nhân vật) — đúng kế hoạch "kết hợp".

## 🧪 Kiểm thử & chất lượng

```bash
npm test          # chạy toàn bộ unit test
npm run typecheck # kiểm tra kiểu TypeScript
```

Lõi game (`src/game/`) và dữ liệu (`src/content/`) là **thuần, không phụ thuộc trình duyệt**, nên
test nhanh và chắc. Tài liệu thiết kế đầy đủ ở [`docs/superpowers/`](docs/superpowers/).

## 🧱 Công nghệ

TypeScript (strict) · Vite · Canvas 2D · Vitest · WebAudio. Không dùng framework game nặng —
nhẹ, dễ đọc, dễ mở rộng.

## 📁 Cấu trúc

```
src/
  engine/    vòng lặp game, bắt phím (chống bộ gõ Telex)
  game/      luật chơi thuần: gõ, điểm, combo, vòng chơi (đã test)
  content/   DỮ LIỆU: bản đồ ngón, nhân vật, cảnh, level   ← sửa ở đây để mở rộng
  keyboard/  bàn phím ảo + bàn tay khỉ hướng dẫn ngón
  scenes/    các màn: menu, chọn nhân vật/cảnh/level, chơi, kết quả
  state/     tiến trình, mở khóa, lưu localStorage
  audio/     âm thanh tổng hợp (WebAudio)
  i18n/      chữ Việt/Anh
```

---

Made for my kid, to make learning to type a joy. 🐵⌨️
