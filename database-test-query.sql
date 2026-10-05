-- MySQL 8.0. Pre test Rivaldy.
-- Satu baris pinjaman mewakili satu buku yang dipinjam seorang anggota.

CREATE TABLE kategori (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nama VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE anggota (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nama VARCHAR(100) NOT NULL,
    alamat TEXT NOT NULL,
    no_ktp VARCHAR(20) NOT NULL UNIQUE,
    no_hp VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE buku (
    id INT PRIMARY KEY AUTO_INCREMENT,
    kategori_id INT NOT NULL,
    judul VARCHAR(255) NOT NULL,
    pengarang VARCHAR(100) NOT NULL,
    penerbit VARCHAR(100) NOT NULL,
    isbn VARCHAR(20) NOT NULL UNIQUE,
    tahun_terbit SMALLINT NOT NULL,
    jumlah_tersedia INT NOT NULL DEFAULT 0,
    CONSTRAINT chk_jumlah_tersedia CHECK (jumlah_tersedia >= 0),
    CONSTRAINT fk_buku_kategori FOREIGN KEY (kategori_id) REFERENCES kategori(id)
);

CREATE TABLE pinjaman (
    id INT PRIMARY KEY AUTO_INCREMENT,
    anggota_id INT NOT NULL,
    buku_id INT NOT NULL,
    tanggal_pinjam DATE NOT NULL,
    tanggal_jatuh_tempo DATE NOT NULL,
    tanggal_kembali DATE NULL,
    CONSTRAINT chk_tanggal_pinjaman CHECK (tanggal_jatuh_tempo >= tanggal_pinjam
        AND (tanggal_kembali IS NULL OR tanggal_kembali >= tanggal_pinjam)),
    CONSTRAINT fk_pinjaman_anggota FOREIGN KEY (anggota_id) REFERENCES anggota(id),
    CONSTRAINT fk_pinjaman_buku FOREIGN KEY (buku_id) REFERENCES buku(id)
);

INSERT INTO kategori (nama) VALUES
('Fiksi'), ('Sains'), ('Sejarah'), ('Teknologi'), ('Biografi');

INSERT INTO anggota (nama, alamat, no_ktp, no_hp, email) VALUES
('User 1', 'Alamat 1', '3171000000000001', '081200000001', 'user1@example.com'),
('User 2', 'Alamat 2', '3171000000000002', '081200000002', 'user2@example.com'),
('User 3', 'Alamat 3', '3171000000000003', '081200000003', 'user3@example.com'),
('User 4', 'Alamat 4', '3171000000000004', '081200000004', 'user4@example.com'),
('User 5', 'Alamat 5', '3171000000000005', '081200000005', 'user5@example.com');

INSERT INTO buku (kategori_id, judul, pengarang, penerbit, isbn, tahun_terbit, jumlah_tersedia) VALUES
(1, 'Buku 1',  'Pengarang 1',  'Penerbit 1', '9780000000001', 2020, 2),
(1, 'Buku 2',  'Pengarang 2',  'Penerbit 1', '9780000000002', 2021, 2),
(2, 'Buku 3',  'Pengarang 3',  'Penerbit 2', '9780000000003', 2022, 2),
(2, 'Buku 4',  'Pengarang 4',  'Penerbit 2', '9780000000004', 2020, 2),
(3, 'Buku 5',  'Pengarang 5',  'Penerbit 3', '9780000000005', 2021, 2),
(3, 'Buku 6',  'Pengarang 6',  'Penerbit 3', '9780000000006', 2022, 2),
(4, 'Buku 7',  'Pengarang 7',  'Penerbit 4', '9780000000007', 2020, 2),
(4, 'Buku 8',  'Pengarang 8',  'Penerbit 4', '9780000000008', 2021, 2),
(5, 'Buku 9',  'Pengarang 9',  'Penerbit 5', '9780000000009', 2022, 2),
(5, 'Buku 10', 'Pengarang 10', 'Penerbit 5', '9780000000010', 2023, 2);

INSERT INTO pinjaman (anggota_id, buku_id, tanggal_pinjam, tanggal_jatuh_tempo, tanggal_kembali) VALUES
(1, 1, '2026-09-01', '2026-09-08', '2026-09-08'),
(1, 2, '2026-09-01', '2026-09-08', '2026-09-08'),
(1, 3, '2026-09-01', '2026-09-08', '2026-09-08'),
(2, 4, '2026-09-01', '2026-09-08', '2026-09-08'),
(2, 5, '2026-09-01', '2026-09-08', '2026-09-08'),
(2, 6, '2026-09-01', '2026-09-08', '2026-09-08'),
(3, 7, '2026-09-01', '2026-09-08', '2026-09-08'),
(3, 8, '2026-09-01', '2026-09-08', '2026-09-08'),
(3, 9, '2026-09-01', '2026-09-08', '2026-09-13');

-- 2. Buku yang tidak pernah dipinjam.
SELECT b.judul AS Buku
FROM buku AS b
LEFT JOIN pinjaman AS p ON p.buku_id = b.id
WHERE p.id IS NULL
ORDER BY b.id;

-- 3. Anggota yang pernah mengembalikan buku terlambat; jumlah semua dendanya.
SELECT a.nama AS `User`,
       CONCAT('Rp', SUM(DATEDIFF(p.tanggal_kembali, p.tanggal_jatuh_tempo) * 1000)) AS Denda
FROM anggota AS a
JOIN pinjaman AS p ON p.anggota_id = a.id
WHERE p.tanggal_kembali > p.tanggal_jatuh_tempo
GROUP BY a.id, a.nama
ORDER BY a.id;

-- 4. Satu baris per anggota peminjam dengan daftar buku (urutan seperti contoh).
SELECT ROW_NUMBER() OVER (ORDER BY daftar.anggota_id) AS No,
       daftar.nama AS `User`,
       daftar.buku AS Buku
FROM (
    SELECT a.id AS anggota_id, a.nama,
           GROUP_CONCAT(b.judul ORDER BY b.id DESC SEPARATOR ', ') AS buku
    FROM anggota AS a
    JOIN pinjaman AS p ON p.anggota_id = a.id
    JOIN buku AS b ON b.id = p.buku_id
    GROUP BY a.id, a.nama
) AS daftar
ORDER BY daftar.anggota_id;
