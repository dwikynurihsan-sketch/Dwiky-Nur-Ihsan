// ===== Bank kata, dikelompokkan per kategori =====
const BANK_KATA = {
  "Hewan": ["KUCING", "ANJING", "GAJAH", "JERAPAH", "KELINCI", "BURUNG", "HARIMAU", "MERPATI"],
  "Buah": ["MANGGA", "PISANG", "APEL", "JERUK", "NANAS", "RAMBUTAN", "ANGGUR", "SEMANGKA"],
  "Negara": ["INDONESIA", "JEPANG", "PERANCIS", "KANADA", "BRASIL", "MESIR", "JERMAN"],
  "Profesi": ["DOKTER", "GURU", "PETANI", "NELAYAN", "POLISI", "PILOT", "KOKI"]
};

const SUSUNAN_KEYBOARD = [
  "QWERTYUIOP".split(""),
  "ASDFGHJKL".split(""),
  "ZXCVBNM".split("")
];

const MAKS_SALAH = 6;

// ===== Elemen DOM =====
const elKategori = document.getElementById("kategori");
const elUbinKata = document.getElementById("ubin-kata");
const elTitikNyawa = document.getElementById("titik-nyawa");
const elSkorMenang = document.getElementById("skor-menang");
const elSkorKalah = document.getElementById("skor-kalah");
const elPesan = document.getElementById("pesan");
const elKeyboard = document.getElementById("keyboard");
const elBtnBaru = document.getElementById("btn-baru");

// ===== State permainan =====
let kataSekarang = "";
let hurufDitebak = new Set();
let jumlahSalah = 0;
let permainanSelesai = false;
let skorMenang = 0;
let skorKalah = 0;

function pilihKataAcak() {
  const daftarKategori = Object.keys(BANK_KATA);
  const kategori = daftarKategori[Math.floor(Math.random() * daftarKategori.length)];
  const daftarKata = BANK_KATA[kategori];
  const kata = daftarKata[Math.floor(Math.random() * daftarKata.length)];
  return { kategori, kata };
}

function mulaiPermainanBaru() {
  const { kategori, kata } = pilihKataAcak();
  kataSekarang = kata;
  elKategori.textContent = kategori;
  hurufDitebak = new Set();
  jumlahSalah = 0;
  permainanSelesai = false;

  elPesan.textContent = "Tebak huruf untuk mengungkap kata!";
  elPesan.className = "pesan";

  renderUbinKata();
  renderTitikNyawa();
  bangunKeyboard();
}

function renderUbinKata() {
  elUbinKata.innerHTML = "";
  for (const huruf of kataSekarang) {
    const ubin = document.createElement("div");
    const sudahDitebak = hurufDitebak.has(huruf);
    ubin.className = "ubin" + (sudahDitebak ? " terisi" : "");
    ubin.textContent = sudahDitebak ? huruf : "";
    elUbinKata.appendChild(ubin);
  }
}

function renderTitikNyawa() {
  elTitikNyawa.innerHTML = "";
  for (let i = 0; i < MAKS_SALAH; i++) {
    const titik = document.createElement("div");
    titik.className = "titik" + (i < MAKS_SALAH - jumlahSalah ? "" : " hilang");
    elTitikNyawa.appendChild(titik);
  }
}

function bangunKeyboard() {
  elKeyboard.innerHTML = "";
  for (const baris of SUSUNAN_KEYBOARD) {
    const elBaris = document.createElement("div");
    elBaris.className = "baris-keyboard";
    for (const huruf of baris) {
      const tombol = document.createElement("button");
      tombol.type = "button";
      tombol.className = "tombol-huruf";
      tombol.textContent = huruf;
      tombol.dataset.huruf = huruf;
      tombol.addEventListener("click", () => tebakHuruf(huruf));
      elBaris.appendChild(tombol);
    }
    elKeyboard.appendChild(elBaris);
  }
}

function tebakHuruf(huruf) {
  if (permainanSelesai || hurufDitebak.has(huruf)) return;

  hurufDitebak.add(huruf);
  const tombol = elKeyboard.querySelector(`[data-huruf="${huruf}"]`);

  if (kataSekarang.includes(huruf)) {
    if (tombol) tombol.classList.add("benar");
  } else {
    jumlahSalah++;
    if (tombol) tombol.classList.add("salah");
  }
  if (tombol) tombol.disabled = true;

  renderUbinKata();
  renderTitikNyawa();
  periksaStatusPermainan();
}

function periksaStatusPermainan() {
  const sudahMenang = [...kataSekarang].every((huruf) => hurufDitebak.has(huruf));
  const sudahKalah = jumlahSalah >= MAKS_SALAH;

  if (sudahMenang) {
    permainanSelesai = true;
    skorMenang++;
    elSkorMenang.textContent = skorMenang;
    elPesan.textContent = "Tepat sekali! Kata berhasil ditebak.";
    elPesan.className = "pesan menang";
    kuncikanKeyboard();
  } else if (sudahKalah) {
    permainanSelesai = true;
    skorKalah++;
    elSkorKalah.textContent = skorKalah;
    elPesan.textContent = `Kesempatan habis. Kata yang benar: ${kataSekarang}`;
    elPesan.className = "pesan kalah";
    kuncikanKeyboard();
  }
}

function kuncikanKeyboard() {
  elKeyboard.querySelectorAll(".tombol-huruf").forEach((t) => (t.disabled = true));
}

// ===== Event listener =====
elBtnBaru.addEventListener("click", mulaiPermainanBaru);

document.addEventListener("keydown", (e) => {
  const huruf = e.key.toUpperCase();
  if (huruf.length === 1 && huruf >= "A" && huruf <= "Z") {
    tebakHuruf(huruf);
  }
});

// ===== Mulai permainan pertama =====
mulaiPermainanBaru();