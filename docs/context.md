# SaaS Wikipedia Summarizer (tanpa authentication)

## Ringkasan singkat

Aplikasi web sederhana yang menerima URL halaman Wikipedia, mengekstrak isi utama artikel, memprosesnya melalui model Groq untuk menghasilkan **satu paragraf artikel ringkas** tanpa nomor sitasi atau teks sitasi inline, dan menampilkan **daftar referensi** (bagian "Referensi" dari Wikipedia) secara terpisah sebagai informasi tambahan. Tidak ada mekanisme autentikasi.

Fitur tambahan: pengguna dapat memilih panjang paragraf ringkasan: **pendek**, **menengah**, atau **panjang**.

---

## Tujuan fungsional utama

1. Input URL Wikipedia.
2. Ambil konten artikel (HTML atau wikitext) dari MediaWiki API.
3. Hapus angka sitasi inline (mis. [1], [2]) dan markup referensi dari teks isi.
4. Pengguna memilih panjang ringkasan: `short` (pendek), `medium` (menengah), `long` (panjang).
5. Kirim teks bersih ke Groq API dengan prompt terstruktur untuk membuat ringkasan satu-paragraf sesuai panjang yang dipilih.
6. Ekstrak daftar referensi (bagian Referensi) dan tampilkan pada kolom terpisah.
7. Tampilkan hasil ringkasan pada textarea read-only yang dapat dicopy.
8. Sediakan tombol untuk mengunduh hasil ringkasan sebagai PDF dan DOCX.

---

## Catatan lisensi dan etika

- Konten Wikipedia berlisensi Creative Commons Attribution-ShareAlike. Meski ringkasan yang dihasilkan bebas dari nomor sitasi inline, aplikasi harus tetap menampilkan sumber asli (dengan menaruh kolom Referensi berisi link/entri referensi dari halaman Wikipedia) untuk memenuhi kebutuhan atribusi. Sertakan juga link ke halaman Wikipedia asli di UI atau footer hasil.

---

## Alur pengguna (UI flow)

1. Pengguna memasukkan URL Wikipedia pada input field (contoh: `https://en.wikipedia.org/wiki/Node.js`).
2. Pengguna memilih panjang ringkasan: **Pendek** / **Menengah** / **Panjang** (default: Menengah).
3. Pengguna klik tombol **Summarize**.
4. Sistem menampilkan status: "Memproses..." (spinner).
5. Setelah selesai: tampilan dua kolom
    - Kiri: Textarea read-only berisi paragraf ringkasan (dapat copy). Tombol: `Copy`, `Download PDF`, `Download DOCX`.
    - Kanan: Daftar Referensi (teks dan / atau URL) yang diambil dari bagian "Referensi" di halaman Wikipedia.

6. Pilihan: tombol `Open source page` yang membuka halaman Wikipedia asli.

---

## Wireframe singkat

```
[ Input URL _____________________________ ] [Dropdown: Pendek ▾ ] [Summarize]

[Left column]                   [Right column]
--------------------------------------------
| Textarea (read-only)         | Referensi list      |
| - One paragraph summary      | - [1] Author, Title |
| Buttons: Copy | PDF | DOCX    | - [2] ...           |
--------------------------------------------
```

---

## Tech stack

- Frontend: React (Vite)
- Backend: Node JS
- Fetch Wikipedia: MediaWiki REST/Action API
- HTML parsing: cheerio (Node)
- Model API: Groq API (HTTP)
- PDF generation: Puppeteer (server-side render -> PDF)
- DOCX generation: `docx` (bun)
- Storage (optional): temporary file storage on server (clean up after download)
- UI: Tailwindcss v4.1, shadcn ui

---

## Backend — endpoint & contract

### Endpoint

**POST** `/api/summarize`

- Request body (JSON):

```json
{ "url": "https://en.wikipedia.org/wiki/Example", "length": "medium" }
```

- `length` boleh bernilai `short`, `medium`, atau `long` (default: `medium`).
- Response (200):

```json
{
  "summary": "... satu paragraf ...",
  "references": [
    { "text": "Author - Title - Journal (Year)", "url": "https://..." },
    ...
  ],
  "pdf_url": "/downloads/abc123.pdf",
  "docx_url": "/downloads/abc123.docx",
  "source_page": "https://en.wikipedia.org/wiki/Example",
  "length": "medium"
}
```

- Errors: 400 untuk invalid URL, 404 jika halaman tidak ditemukan, 500 untuk error internal.

### Langkah-langkah pemrosesan (server-side)

1. **Validasi URL**: pastikan domain `wikipedia.org` (atau subdomain bahasa) dan ekstrak title.
2. **Ambil konten**: gunakan MediaWiki API untuk mendapatkan HTML bersih (contoh: `action=parse` atau REST `page/mobile-sections` / `page/html`).
3. **Parsing & pembersihan**:
    - Parse HTML dengan cheerio/BeautifulSoup.
    - Hapus elemen sitasi inline: `sup.reference`, span/links yang mewakili referensi inline.
    - Ambil teks konten utama (biasanya `#content` / `.mw-parser-output`) dan konkat paragraf yang relevan.
    - Ambil bagian "Referensi" (biasanya section dengan id `References` atau section index yang bertipe references) dan ekstrak item referensi (teks + URL jika tersedia).

4. **Sanity check**: jika teks terlalu panjang, trim atau gunakan chunking sebelum mengirim ke Groq.
5. **Bangun prompt** untuk Groq dengan instruksi panjang ringkasan sesuai parameter.
6. **Panggil Groq API** dengan teks artikel sebagai input dan prompt yang meminta ringkasan 1 paragraf.
7. **Terima hasil** dan simpan hasil ringkasan + referensi.
8. **Generate file**: buat PDF dan DOCX dari template HTML sederhana yang berisi ringkasan dan metadata (title, sumber, tanggal). Simpan sementara dan kembalikan link untuk diunduh.
9. **Cleanup**: jadwalkan penghapusan file sementara setelah X menit.

---

## Prompt template (contoh) — dikirim ke Groq

```
You are an expert content summarizer. Produce a single coherent paragraph in Indonesian that summarizes the following Wikipedia article content. Remove all citation markers (for example: [1], [2]) and do not include any inline citation numbers or footnote text inside the paragraph. Keep the summary neutral, factual, and concise. Do not invent facts. After the paragraph, do not append any references — references will be returned separately.

Length instruction: {{LENGTH_INSTRUCTION}}
- For `short`: produce a very concise paragraph (1-2 sentences).
- For `medium`: produce a concise paragraph (3-6 sentences).
- For `long`: produce a more detailed single paragraph (6-10 sentences), still avoiding unnecessary detail or speculation.

Article content:
{{ARTICLE_HTML_OR_TEXT}}
```

Catatan: jika target bahasa lain, ganti instruksi bahasa pada prompt.

---

## Frontend — behavior & komponen utama

- **InputBar**: input URL + dropdown pilihan panjang (`Pendek`, `Menengah`, `Panjang`) + tombol Summarize
- **StatusIndicator**: spinner / pesan error
- **ResultArea**: textarea read-only menampilkan ringkasan; tombol `Copy` (clipboard), `Download PDF`, `Download DOCX`.
- **ReferencesPanel**: scrollable list of references dengan link bila ada.
- **Accessibility**: pastikan textarea dapat diseleksi & dikopi; tombol keyboard-accessible.

---

## File generation (PDF & DOCX)

- **PDF**: render HTML hasil ringkasan (template sederhana) server-side dan gunakan Puppeteer untuk print-to-PDF. Alternatif ringan: jsPDF di client (tapi server-side lebih konsisten untuk styling dan fonts).
- **DOCX**: gunakan `docx` (Node) atau `python-docx` untuk membuat file .docx yang berisi: judul, ringkasan, daftar referensi, dan link sumber.
- Sertakan metadata di dokumen: sumber halaman, tanggal ringkasan, opsi panjang yang dipilih.
- Kembalikan file melalui endpoint `/downloads/:id` dengan header `Content-Disposition: attachment`.

---

## Performance, rate-limiting & biaya

- Batasi ukuran input (mis. max 200 KB HTML) atau panjang teks (mis. 50.000 karakter) sebelum dikirim ke Groq.
- Batasi frekuensi pemanggilan per IP (mis. 10 permintaan / menit) untuk menghindari biaya besar dan abuse.
- Gunakan queue untuk memproses permintaan bila Groq API lambat.

---

## Error handling & edge cases

- Halaman Wikipedia dengan redirect: follow redirect atau ekstrak canonical title.
- Halaman dengan banyak template / infobox: pastikan mengekstrak hanya `mw-parser-output` paragraf utama.
- Halaman sangat pendek: kembalikan teks asli (setelah pembersihan) dan beri peringatan bahwa ringkasan sama dengan konten sumber.
- Jika referensi tidak ada/terformat beda: tampilkan pesan kosong atau "Tidak ada referensi terdeteksi".

---

## Keamanan & privasi

- Jangan menyimpan konten pengguna lebih lama dari yang diperlukan.
- Hapus file sementara setelah jangka waktu singkat.
- Sanitasi HTML sebelum rendering untuk mencegah XSS pada preview.

---

## Monitoring & logging

- Logging per-request: url, title, waktu proses, status Groq call, error.
- Metrics: request / menit, rata-rata latency (fetch wiki, Groq call, PDF generation)

---

## Fitur lanjutan (opsional)

- Pilihan panjang ringkasan (short / medium / long) — sudah diimplementasikan.
- Pilihan bahasa target terjemahan ringkasan.
- Batch mode: upload CSV berisi list URL dan proses batch.
- UI: preview mode untuk melihat HTML yang dibersihkan sebelum dikirim ke model.
