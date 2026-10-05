# Backend Test - Concurrent Even Sum

Program Go untuk menghitung jumlah bilangan genap dalam sebuah slice. Proses perhitungan dibagi ke beberapa worker agar setiap bagian dapat dikerjakan secara concurrent.

## Cara kerja

`SumEven` membagi slice menjadi beberapa chunk sesuai jumlah worker. Setiap worker menghitung subtotal dari chunk miliknya, lalu mengirimkan hasil melalui channel.

`sync.WaitGroup` digunakan untuk menunggu seluruh worker selesai sebelum channel ditutup. Penjumlahan akhir dilakukan pada satu goroutine, sehingga tidak ada shared variable yang ditulis oleh beberapa worker secara bersamaan.

Jumlah worker dibatasi agar minimal satu dan tidak melebihi jumlah elemen. Fungsi mengembalikan `int64` agar hasil penjumlahan lebih aman untuk slice berukuran besar.

## Menjalankan program

```sh
go run .
```

Contoh output untuk satu juta bilangan:

```text
Sum of even numbers: 250000500000
```

## Testing

Jalankan unit test, coverage, dan pemeriksaan statis:

```sh
go test ./...
go test -cover ./...
go vet ./...
```

Tes mencakup berbagai bentuk input, batas jumlah worker, konsistensi hasil antar-worker, dan slice berisi satu juta elemen.

Race detector dapat dijalankan melalui Docker dari PowerShell:

```powershell
$projectPath = (Get-Location).Path

docker run --rm `
  --mount "type=bind,source=$projectPath,target=/app" `
  --workdir /app `
  golang:1.27.1-bookworm `
  go test -race ./...
```

Untuk membandingkan satu dan empat worker:

```sh
go test -bench=. -benchmem
```

GitLab CI juga menjalankan unit test, race detector, dan `go vet` pada setiap pipeline.
