# Chess Lonely Knight

Aplikasi frontend untuk membuat papan catur dinamis dan memindahkan satu kuda sesuai aturan gerak catur. Project dibuat dengan React, TypeScript, dan Vite.

## Fitur

- Membuat papan berukuran 1–100 baris dan kolom.
- Menempatkan kuda di pojok kiri atas setiap kali papan dibuat.
- Menandai tujuan yang valid dengan warna hijau saat hover.
- Menandai kotak yang tidak valid dan posisi kuda dengan warna merah saat hover.
- Memindahkan kuda hanya ketika kotak tujuan valid.
- Mendukung papan hingga 100×100 dengan area yang dapat di-scroll.

## Menjalankan aplikasi

Gunakan Node.js 22.12 atau versi yang lebih baru.

```sh
npm install
npm run dev
```

Buka URL yang ditampilkan Vite di terminal, biasanya `http://localhost:5173`.

Jika PowerShell memblokir `npm.ps1`, gunakan `npm.cmd` sebagai pengganti `npm`:

```powershell
npm.cmd install
npm.cmd run dev
```

## Testing

Jalankan unit test dan build produksi:

```sh
npm test
npm run build
```

Mode test interaktif dan preview build tersedia melalui:

```sh
npm run test:watch
npm run preview
```

Unit test mencakup logika gerak kuda, batas papan, validasi input, perpindahan, dan reset saat papan dibuat ulang. Tampilan hover dan responsivitas tetap perlu diperiksa langsung di browser.

## Checklist manual

Koordinat dihitung dari 1, dimulai dari pojok kiri atas.

| Skenario | Hasil yang diharapkan |
| --- | --- |
| Buka aplikasi | Papan awal berukuran 8×8 dan hanya memiliki satu K di posisi (1,1) |
| Hover posisi (2,3) atau (3,2) | Background kotak berubah hijau |
| Hover kotak lain atau posisi K | Background kotak berubah merah |
| Klik kotak yang tidak valid | Posisi K tidak berubah |
| Klik kotak yang valid | K berpindah dan tujuan berikutnya diperbarui |
| Generate ulang setelah K berpindah | K kembali ke posisi (1,1) |
| Masukkan nilai kosong, desimal, 0, atau lebih dari 100 | Pesan error muncul dan papan sebelumnya tetap dipertahankan |
| Generate papan 1×1, 3×5, dan 100×100 | Papan terbentuk dengan benar dan papan besar dapat di-scroll |

## Struktur project

```text
src/
├── components/
│   ├── Board.tsx
│   └── Square.tsx
├── types/
│   └── chess.ts
├── utils/
│   ├── dimensions.ts
│   └── knightMoves.ts
├── App.tsx
├── App.css
└── main.tsx
```

`Board` mengelola posisi kuda dan tujuan yang valid, sedangkan `Square` menangani tampilan serta interaksi setiap kotak. Logika gerakan dan validasi ukuran ditempatkan di luar komponen agar dapat diuji secara terpisah.

Tujuan kuda disimpan dalam `Set` agar pengecekan setiap kotak tetap cepat. Hover ditangani melalui CSS sehingga tidak menambah pembaruan state ketika pointer berpindah.
