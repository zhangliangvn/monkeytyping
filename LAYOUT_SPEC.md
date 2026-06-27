# 🐵 KHỈ TẬP GÕ (Monkey Typing) — Đặc tả Layout đầy đủ

> Tài liệu liệt kê toàn bộ tính năng & màn hình của game, viết để đưa cho AI vẽ layout.
> Vị trí mô tả theo % chiều rộng `W` / chiều cao `H` (đúng như game đang dựng), để AI vẽ sát thực tế.

---

## 0. Tổng quan & nhận diện hình ảnh

- **Thể loại:** Game học gõ 10 ngón (touch-typing) cho trẻ em, vẽ toàn màn hình trên Canvas (không có HTML/DOM, mọi thứ là đồ họa vẽ tay).
- **Đối tượng:** Trẻ em / người mới học gõ; phong cách dễ thương, "thất bại nhẹ nhàng" (không có "Game Over" gắt).
- **2 ngôn ngữ:** Tiếng Việt (mặc định) + English, đổi được mọi lúc.
- **Điều khiển:** Toàn bộ điều hướng bằng **phím mũi tên ← → ↑ ↓ + Enter + Esc**; khi chơi thì gõ ký tự trên màn hình.

### Bảng màu chủ đạo
- Nền tối gradient xanh đêm: `#1a1a2e → #10162e` (và biến thể `#16213e`, `#0e1530`)
- Màu nhấn vàng chuối: `#ffd166`, `#ffe08a`
- Chữ trắng `#ffffff` (thường giảm độ mờ 0.45–0.85)
- Xanh lá "chính xác": `#9ef0a0`; Đỏ "sai": `#ff3b3b`

### Màu theo ngón tay (rất quan trọng – dùng xuyên suốt)
| Ngón | Màu |
|---|---|
| Út (pinky) trái/phải | Tím `#a855f7` |
| Áp út (ring) | Xanh dương `#3b82f6` |
| Giữa (middle) | Đỏ `#ef4444` |
| Trỏ (index) | Xanh lá `#22c55e` |
| Cái (thumb) | Xám `#9ca3af` |
| Phím với xa (reach: T,Y,G,H,B,N,4,5,6,7) | Vàng cảnh báo `#eab308` |

### Khác
- **Font:** `'Segoe UI'` (UI), `'Consolas'/monospace` (từ đang gõ).
- **Tiền tệ trong game:** 🍌 **Chuối (banana)** — tích lũy, không bao giờ bị trừ.
- **Phần thưởng:** ⭐ **Sao** (0–3 sao mỗi level theo độ chính xác).

---

## 1. MÀN HÌNH CHÍNH (Menu)

Bố cục dọc, căn giữa:

| Vị trí (Y) | Nội dung |
|---|---|
| ~12.5% | **Mặt nhân vật đang chọn** (vẽ tay, nhún nhảy lên xuống nhẹ) |
| ~24.5% | **Tiêu đề game** "Khỉ Tập Gõ" — chữ vàng `#ffd166`, đậm, lớn |
| ~30.5% | `🍌 [số chuối]` |
| ~34.5% | `[emoji] [tên nhân vật đang chọn]` (chữ trắng mờ) |
| 42% → xuống | **8 nút menu dạng hộp bo góc**, mỗi nút cách nhau ~6.2%H, rộng 32%W |
| ~95% | Dòng gợi ý điều hướng: "← → ↑ ↓ chọn · Enter xác nhận · Esc quay lại" |

**8 mục menu (theo thứ tự):**
1. ▶ Chơi (luyện tập)
2. 🚀 Bắn chữ (Arcade)
3. 🦈 Cá mập (Shark)
4. 🎯 Chọn Level
5. 🐵 Nhân vật
6. 🌴 Cảnh
7. 🔊 Bật tiếng / 🔇 Tắt tiếng (toggle)
8. 🌐 Tiếng Việt / English (toggle)

**Trạng thái nút được chọn:** nền vàng mờ `#ffd166` 22%, viền vàng + hiệu ứng phát sáng (glow/shadow).

---

## 2. CHỌN NHÂN VẬT (Character Select)

Lưới **5 cột** chứa **14 nhân vật khỉ**.

| Vị trí | Nội dung |
|---|---|
| ~10% | Tiêu đề "Chọn Nhân Vật" (vàng) |
| góc phải ~6% | `🍌 [số chuối]` |
| 20% → | Lưới thẻ nhân vật (5 cột × 3 hàng) |
| ~96% | Gợi ý điều hướng |

**Mỗi thẻ nhân vật:**
- Nền bo góc, tô màu nhấn riêng của nhân vật (mờ).
- **Đã mở khóa:** vẽ mặt nhân vật + tên.
- **Bị khóa:** hiện `❔` (silhouette) + `🔒 [giá]🍌`.
- Nhân vật **đang chọn:** dấu `✓` ở góc trên phải.
- Thẻ **đang trỏ tới:** viền màu nhấn + glow nhấp nháy.

**14 nhân vật (chia theo 4 thế giới, giá chuối tăng dần):**

| # | Tên | Emoji | Năng lực | Giá 🍌 | Thế giới |
|---|---|---|---|---|---|
| 1 | Cinnamoroll (chó trắng vẽ tay) | 🐶 | Bay lượn | 0 (free) | Rừng |
| 2 | Khỉ Mèo | 🐱 | Vồ mồi | 40 | Rừng |
| 3 | Khỉ Ninja | 🥷 | Phi tiêu | 120 | Rừng |
| 4 | Khỉ Cướp Biển | 🏴‍☠️ | Đại bác | 200 | Sa mạc |
| 5 | Khỉ Công Chúa | 👸 | Lấp lánh | 320 | Sa mạc |
| 6 | Khỉ Múa | 🩰 | Xoay né | 460 | Sa mạc |
| 7 | Khỉ Tiên Cá | 🧜 | Bong bóng | 620 | Đại dương |
| 8 | Khỉ Tiên | 🧚 | Pháo hoa | 800 | Đại dương |
| 9 | Khỉ Nhện | 🕷️ | Tơ nhện | 1000 | Đại dương |
| 10 | Khỉ Phi Hành Gia | 🧑‍🚀 | Tên lửa | 1240 | Vũ trụ |
| 11 | Khỉ Siêu Nhân | 🦸 | Tia laze | 1500 | Vũ trụ |
| 12 | Khỉ Người Sắt | 🤖 | Súng tay | 1780 | Vũ trụ |
| 13 | Khỉ Khổng Lồ | 🦍 | Đập tan | 2080 | Vũ trụ |
| 14 | Khỉ Băng Giá | ☃️ | Đóng băng | 2400 | Vũ trụ |

> Lưu ý: hiện chỉ **Cinnamoroll** được vẽ tay đầy đủ (chó trắng tai dài, mắt xanh, má hồng, lọn tóc xoăn trên đầu); các nhân vật khác đang dùng emoji placeholder — **đây chính là phần cần AI vẽ thành nhân vật thật.**

---

## 3. CHỌN CẢNH (Scene Select)

**4 thế giới** xếp hàng ngang, mỗi thẻ là 1 ô lớn (cao ~42%H) hiển thị **preview gradient bầu trời** của thế giới đó.

| # | Thế giới | Emoji | Trời trên → dưới | Màu nhấn |
|---|---|---|---|---|
| 1 | Rừng Rậm | 🌴 | `#1e3a1e → #0e2a14` | Xanh lá `#8bc34a` |
| 2 | Sa Mạc | 🏜️ | `#caa15a → #7a4a2b` | Vàng `#ffd166` |
| 3 | Đại Dương | 🌊 | `#0a3d6b → #062544` | Xanh ngọc `#4dd0e1` |
| 4 | Vũ Trụ | 🚀 | `#1a0a3e → #0a0a2e` | Tím `#b388ff` |

- Thế giới **chưa mở khóa:** làm mờ (alpha 0.55) + hiện `🔒`.
- Đang chọn: viền màu nhấn + glow; đang dùng: `✓`.
- Mở khóa thế giới kế tiếp khi **hoàn thành tất cả level của thế giới trước** (đạt ≥1 sao mỗi level).

---

## 4. CHỌN LEVEL (Level Select)

Lưới **4 cột** chứa **14 level** theo lộ trình học.

**Mỗi thẻ level hiển thị:**
- Icon theo chế độ: `🔤` (ABC) · `📝` (Word) · `🇻🇳` (Telex) + số thứ tự, hoặc `🔒` nếu khóa.
- Tên level.
- **Dãy 3 sao** `★★★ / ☆☆☆` thể hiện sao đã đạt (vàng).
- Màu nhấn theo thế giới của level.
- Level mở khóa tuần tự (level trước đạt ≥1 sao thì mở level sau).

**14 level (lộ trình từ tâm bàn phím ra ngoài):**

| Lv | Tên | Chế độ | Thế giới | Phím học |
|---|---|---|---|---|
| 1 | Phím nhà F & J | ABC | Rừng | f, j |
| 2 | D & K | ABC | Rừng | f j d k |
| 3 | Cả hàng cơ sở | ABC | Rừng | a s d f j k l ; |
| 4 | Với G & H | ABC | Rừng | cả home row |
| 5 | Từ hàng cơ sở | Word | Rừng | home row |
| 6 | E I R U | ABC | Sa mạc | + e i r u |
| 7 | Hết hàng trên | ABC | Sa mạc | + q w e r t y u i o p |
| 8 | Từ hàng trên | Word | Sa mạc | hàng trên |
| 9 | V M B N | ABC | Đại dương | + v m b n |
| 10 | Hết hàng dưới | ABC | Đại dương | + z x c v b n m , . / |
| 11 | Từ đầy đủ | Word | Đại dương | toàn bảng chữ |
| 12 | Trôi chảy | Word | Vũ trụ | toàn bảng chữ |
| 13 | Telex: thêm dấu | Telex | Vũ trụ | gõ tiếng Việt có dấu |
| 14 | Telex: từ đầy đủ | Telex | Vũ trụ | từ Việt đầy đủ |

---

## 5. WIDGET BÀN PHÍM (dùng chung mọi màn chơi — điểm khác biệt số 1)

Đây là thành phần quan trọng nhất, xuất hiện ở **mọi màn gameplay** (thường ở nửa dưới màn hình, vùng ~ x:6%, y:56–71%, rộng 86–88%, cao 26–38%).

Bàn phím QWERTY đầy đủ với **3 kênh chỉ dẫn đồng thời** (không bao giờ chỉ dùng màu):
1. **Màu sắc:** mỗi phím tô màu theo ngón tay phụ trách (bảng màu ở mục 0) + có một dải màu dưới chân phím.
2. **Bàn tay khỉ:** vẽ **2 bàn tay/chân khỉ màu nâu** (`#6b4226`) bán trong suốt nằm dưới bàn phím, các ngón đặt trên hàng cơ sở; ngón đúng **vươn lên chạm phím tiếp theo** (có animation trượt + đổi sang màu ngón + phát sáng).
3. **Vị trí:** nền trái/phải khác sắc, **đường kẻ chia G/H** (nét đứt giữa bàn phím), và **gờ nổi trên phím F & J** (home bumps).

- **Phím tiếp theo cần gõ:** viền sáng + glow nhấp nháy theo nhịp `pulse`, chữ trắng có viền tối để luôn đọc rõ kể cả khi bị bàn tay che.
- **Gõ sai:** phím nhấp nháy **đỏ** `#ff3b3b`.
- Phím chức năng có ký hiệu rút gọn: `␣ ⌫ ⏎ ⇧ ⇪ ⇥`.

---

## 6. MÀN CHƠI — ABC (luyện từng phím)

Dạy đặt ngón cho **từng chữ cái đơn**. Mục tiêu: 20 chữ/vòng.

| Vị trí (Y) | Nội dung |
|---|---|
| góc trên trái ~6% | `🎯 [%]` độ chính xác (xanh lá) |
| trên giữa ~6% | `[đã làm]/20` |
| góc trên phải ~6% | `🔥 [combo]` (vàng) |
| ~16% | **Mặt nhân vật** (nảy lên khi gõ đúng) |
| ~34% | **Chữ cái mục tiêu CỠ LỚN**, tô theo màu ngón tay |
| ~47% | Gợi ý: "Dùng [tên ngón]" (ví dụ "Dùng ngón trỏ trái") |
| 56–94% | **Widget bàn phím** |

---

## 7. MÀN CHƠI — WORD (gõ nguyên từ)

Gõ nguyên từ ASCII không dấu. Mục tiêu: 10 từ/vòng. Có **đường đua tiến độ**.

| Vị trí (Y) | Nội dung |
|---|---|
| ~6% | HUD: trái `🎯 [%]`, giữa `Từ [x]/10`, phải `🔥 [combo]` |
| ~16% | **Đường đua ngang**: mặt nhân vật **nhảy lò cò** chạy từ trái → cờ đích `🏁` ở phải, theo % hoàn thành |
| ~40% | **Từ hiện tại CỠ LỚN**, tô màu kiểu Monkeytype: chữ đã gõ = trắng sáng, **chữ hiện tại = con trỏ màu ngón** (có gạch chân màu), chữ chưa gõ = mờ |
| ~52% | Gợi ý "Dùng [tên ngón]" cho chữ kế tiếp |
| 58–94% | **Widget bàn phím** |

> Khi đang chơi ABC/Word, nhấn **Tab** để đổi qua lại giữa 2 chế độ.

---

## 8. MÀN CHƠI — TELEX (siêu năng lực tiếng Việt) 🇻🇳

Dạy gõ **từ tiếng Việt có dấu** trên bàn phím QWERTY bằng kiểu Telex.

| Vị trí (Y) | Nội dung |
|---|---|
| ~6% | HUD: `🎯 [%]` · `🇻🇳 Telex [x]/10` · `🔥 [combo]` |
| ~15% | **Mặt nhân vật** (nhảy khi xong từ) |
| ~36% | **Từ tiếng Việt CỠ LỚN có dấu** (vd "mèo"), tô màu theo tiến độ gõ từng ký tự |
| ~49% | **Gợi ý cách tạo dấu**: ví dụ "è = e ▸ f" (vàng) |
| ~54.5% | Gợi ý ngón + phím: "Dùng [ngón] — phím [X]" |
| 58–94% | **Widget bàn phím** (hiện phím Telex cần gõ tiếp) |

> Cơ chế Telex: vd "mèo" → gõ `m e f o`; dấu được đặt ngay sau nguyên âm. Hỗ trợ: dấu sắc(s) huyền(f) hỏi(r) ngã(x) nặng(j), và â(aa) ê(ee) ô(oo) ă(aw) ơ(ow) ư(uw) đ(dd).

---

## 9. MÀN CHƠI — ARCADE / BẮN CHỮ 🚀 (kiểu ZType)

Quái mang chữ **rơi từ trên xuống**, khỉ bắn hạ. Mục tiêu: hạ 12 quái. Có 3 ❤️.

**Bố cục:**
- **Nền:** gradient tím vũ trụ `#0a0a2e → #161a33`.
- **Quái:** emoji `👾 🦇 🐛 🌀 👻 🦅 🐍 🪨` rơi từ y~6% xuống, **dưới mỗi quái là 1 từ** cần gõ.
- **Cơ chế khóa mục tiêu (lock-on):** gõ đúng chữ đầu sẽ khóa vào 1 quái (viền vàng quanh từ); gõ hết từ → khỉ **bắn tia laze** (`#ffe08a`, có glow) + **vụ nổ hạt particle** + âm thanh. (Các từ trên màn không trùng chữ cái đầu nên không bao giờ nhập nhằng.)
- **Khỉ:** ở giữa dưới (~y 60%), nảy lên khi bắn trúng.
- **HUD trên cùng (~6%):** trái `⭐ [điểm]` · giữa `❤️❤️❤️` (tim) · phải `💥 [đã hạ]/12`.
- **Widget bàn phím** ở dưới cùng (~71–97%), chỉ phím tiếp theo của từ đang khóa.
- **Thất bại nhẹ nhàng:** quái chạm đáy → mất 1 tim (nổ đỏ `#ff6b6b`), không "Game Over" gắt; hết tim → ra màn kết quả tích cực. Quái rơi nhanh dần & ra nhanh dần.

---

## 10. MÀN CHƠI — SHARK / CÁ MẬP 🦈 (áp lực thời gian)

Cá mập bơi dần về phía khỉ; **vị trí cá mập chính là đồng hồ đếm ngược**. Mục tiêu: 15 từ. Có 3 ❤️.

**Bố cục:**
- **Nền biển:** gradient xanh `#0a3d6b → #0e5a86 → #062544`, mặt nước ở ~42%H.
- **Khỉ** ngồi trên **phao 🛟** ở trái (~x16%).
- **Cá mập 🦈** (lật mặt sang trái) bơi từ phải (~x95%) về phía khỉ (vùng cắn ~x28%).
- **Thanh nguy hiểm** (danger bar) ở ~14%H, giữa, rộng 50%W: xanh `#4caf50` → vàng → đỏ `#ff4d4d` khi cá mập tới gần.
- Khi cá mập gần: **viền đỏ cảnh báo** nhấp nháy phủ màn hình; khi cắn: chớp đỏ + mất 1 tim + khỉ nhấp nháy "bất tử" tạm thời.
- **Từ cần gõ CỠ LỚN** ở ~27% (tô màu con trỏ theo ngón), gợi ý "phím [X]" ở ~36%.
- **HUD ~6%:** `⭐ [điểm]` · `❤️❤️❤️` · `🐟 [x]/15`.
- **Widget bàn phím** ở ~60–94%.
- **Cơ chế:** gõ đúng đẩy lùi cá mập 1 chút (mỗi ký tự), xong 1 từ đẩy lùi nhiều; cá mập bơi nhanh dần theo số từ đã xong.

---

## 11. MÀN KẾT QUẢ (Results)

Hiện sau mỗi vòng — khung tích cực, không trừng phạt.

| Vị trí (Y) | Nội dung |
|---|---|
| ~14% | "🎉 Hoàn thành!" (vàng, lớn) |
| ~27% | **3 ngôi sao** ⭐/☆ (sao đạt được bật lên với hiệu ứng "pop") |
| ~42% | `🎯 Chính xác: [%]` (xanh lá) |
| ~50% | `🍌 +[chuối kiếm được]` |
| ~59% | **Băng rôn mở khóa mới** (nếu có): "🎁 Mở khóa mới! [nhân vật/cảnh]" có glow nhấp nháy |
| 72% & 82% | 2 nút: **➡ Tiếp tục** và **🔄 Thử lại** |

**Quy tắc tính:**
- Sao theo độ chính xác: ≥95% = 3⭐, ≥85% = 2⭐, ≥70% = 1⭐.
- Chuối kiếm được = `(số từ × 5 × (0.5 + độ chính xác)) + (sao × 10)`.
- Nhân vật tự mở khóa khi tổng chuối tích lũy đạt mốc giá của nó.

---

## 12. Hệ thống chung khác (gợi ý cho AI để vẽ icon/hiệu ứng)

- **Combo 🔥:** mỗi 3 từ liên tiếp lên 1 bậc (tối đa 6 bậc); gõ sai reset về 0. Mỗi bậc làm âm thanh cao dần.
- **Âm thanh:** tổng hợp bằng WebAudio (không file): tiếng gõ đúng cao dần trong 1 từ, tiếng xong từ, lên combo, nhặt chuối, gõ sai, mở khóa. Có nút bật/tắt tiếng.
- **Lưu tiến trình:** tự lưu (localStorage) — chuối, sao, nhân vật/cảnh đã mở, nhân vật/cảnh đang chọn, "độ tự tin" từng phím (cho engine thích ứng tương lai).
- **Mọi thứ co giãn theo kích thước màn hình** (responsive, theo % W/H) — AI nên thiết kế layout linh hoạt, không cố định pixel.
