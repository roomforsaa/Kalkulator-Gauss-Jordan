
// Mengatur tampilan angka agar tidak memiliki nol desimal berlebihan
function formatAngka(nilai) {
    return Number(nilai.toFixed(4)).toString();
}


// ==========================================
// FUNGSI GAUSS-JORDAN
// ==========================================

function gaussJordan(matrix) {

    // Membuat salinan matriks agar data asli tidak berubah
    let A = matrix.map(row => [...row]);

    let rows = A.length;
    let cols = A[0].length;

    let pivotRow = 0;

    // Menyimpan riwayat langkah Gauss-Jordan
    let langkah = [];

    // Fungsi untuk menyimpan kondisi matriks
    function simpanLangkah(keterangan) {

        langkah.push({
            keterangan: keterangan,
            matriks: A.map(row => [...row])
        });
    }

    // Menyimpan matriks awal
    simpanLangkah("Matriks awal");

    // Menelusuri setiap kolom
    for (let col = 0; col < cols - 1; col++) {

        if (pivotRow >= rows) {
            break;
        }

        // Mencari baris dengan elemen pivot bukan nol
        let selectedRow = pivotRow;

        while (
            selectedRow < rows &&
            Math.abs(A[selectedRow][col]) < 1e-10
        ) {
            selectedRow++;
        }

        // Jika seluruh elemen pada kolom nol
        if (selectedRow === rows) {
            continue;
        }

        // Menukar baris jika diperlukan
        if (selectedRow !== pivotRow) {

            [A[pivotRow], A[selectedRow]] =
            [A[selectedRow], A[pivotRow]];

            simpanLangkah(
                `Tukar baris B${pivotRow + 1} dengan B${selectedRow + 1}`
            );
        }

        // Membuat elemen pivot menjadi 1
        let pivot = A[pivotRow][col];

        if (Math.abs(pivot - 1) > 1e-10) {

            for (let j = 0; j < cols; j++) {
                A[pivotRow][j] /= pivot;
            }

            simpanLangkah(
                `B${pivotRow + 1} dibagi ${formatAngka(pivot)}`
            );
        }

        // Menghilangkan elemen lain pada kolom pivot
        for (let i = 0; i < rows; i++) {

            if (i !== pivotRow) {

                let factor = A[i][col];

                if (Math.abs(factor) > 1e-10) {

                    for (let j = 0; j < cols; j++) {
                        A[i][j] -= factor * A[pivotRow][j];
                    }

                    simpanLangkah(
                        `B${i + 1} dikurangi ${formatAngka(factor)} × B${pivotRow + 1}`
                    );
                }
            }
        }

        pivotRow++;
    }

    // Mengembalikan hasil dan seluruh riwayat langkah
    return {
        hasil: A,
        langkah: langkah
    };
}


// ==========================================
// MEMBUAT INPUT MATRIKS
// ==========================================

function buatMatriks() {

    let ukuran = parseInt(
        document.getElementById("ukuran").value
    );

    let container = document.getElementById(
        "matriks-container"
    );

    // Mengosongkan tampilan sebelumnya
    container.innerHTML = "";

    let matriks = document.createElement("div");

    matriks.className = "matriks";

    matriks.style.gridTemplateColumns =
        `repeat(${ukuran + 1}, 65px)`;

    // Membuat kotak input
    for (let i = 0; i < ukuran; i++) {

        for (let j = 0; j <= ukuran; j++) {

            let input = document.createElement("input");

            input.type = "number";
            input.step = "any";
            input.placeholder = j === ukuran ? "b" : "0";

            input.id = `a-${i}-${j}`;

            matriks.appendChild(input);
        }
    }

    container.appendChild(matriks);
}


// ==========================================
// MENGHITUNG GAUSS-JORDAN
// ==========================================

function hitungMatriks() {

    let ukuran = parseInt(
        document.getElementById("ukuran").value
    );

    let matrix = [];

    // Mengambil angka dari input pengguna
    for (let i = 0; i < ukuran; i++) {

        let row = [];

        for (let j = 0; j <= ukuran; j++) {

            let input = document.getElementById(`a-${i}-${j}`);

            if (!input || input.value === "") {
                alert("Semua elemen matriks harus diisi!");
                return;
            }

            let nilai = Number(input.value);

            if (!Number.isFinite(nilai)) {
                alert("Masukkan angka yang valid!");
                return;
            }

            row.push(nilai);
        }

        matrix.push(row);
    }

    // Menghitung Gauss-Jordan
    let proses = gaussJordan(matrix);

    let hasil = proses.hasil;
    let langkah = proses.langkah;

    // Memeriksa jenis solusi
    let adaKontradiksi = false;
    let jumlahPivot = 0;

    // Menyimpan posisi pivot setiap baris
    let kolomPivot = [];

    for (let i = 0; i < ukuran; i++) {

        let semuaNol = true;

        // Memeriksa kolom koefisien
        for (let j = 0; j < ukuran; j++) {

            if (Math.abs(hasil[i][j]) > 1e-10) {
                semuaNol = false;
                break;
            }
        }

        // Memeriksa kontradiksi
        if (
            semuaNol &&
            Math.abs(hasil[i][ukuran]) > 1e-10
        ) {
            adaKontradiksi = true;
        }

        // Menghitung dan menyimpan posisi pivot
        if (!semuaNol) {

            jumlahPivot++;

            for (let j = 0; j < ukuran; j++) {

                if (Math.abs(hasil[i][j]) > 1e-10) {
                    kolomPivot.push(j);
                    break;
                }
            }
        }
    }

    // Menentukan variabel bebas
    let variabelBebas = [];

    for (let j = 0; j < ukuran; j++) {

        if (!kolomPivot.includes(j)) {
            variabelBebas.push(j);
        }
    }

    // Mengambil tempat untuk menampilkan hasil
    let container = document.getElementById("hasil-container");

container.innerHTML = "";

// Bagian langkah-langkah
let bagianLangkah = document.createElement("div");

let judulLangkah = document.createElement("h3");
judulLangkah.textContent = "Langkah-langkah Gauss-Jordan";
judulLangkah.className = "judul-langkah";

bagianLangkah.appendChild(judulLangkah);

// Bagian hasil akhir
let bagianHasil = document.createElement("div");
bagianHasil.className = "bagian-hasil";
    // ==========================================
    // MENAMPILKAN LANGKAH-LANGKAH
    // ==========================================

    langkah.forEach((item, index) => {

        let kartu = document.createElement("div");
        kartu.className = "kartu-langkah";

        let judul = document.createElement("h4");

        judul.textContent =
            `Langkah ${index}: ${item.keterangan}`;

        kartu.appendChild(judul);

        let tabel = document.createElement("table");
        tabel.className = "tabel-matriks";

        item.matriks.forEach(row => {

            let tr = document.createElement("tr");

            row.forEach((nilai, kolom) => {

                let td = document.createElement("td");

                td.textContent = formatAngka(nilai);

                if (kolom === ukuran) {
                    td.className = "kolom-konstanta";
                }

                tr.appendChild(td);
            });

            tabel.appendChild(tr);
        });

        kartu.appendChild(tabel);
        bagianLangkah.appendChild(kartu);
    });


    // ==========================================
    // MENAMPILKAN HASIL AKHIR
    // ==========================================

    let judulHasil = document.createElement("h3");
    judulHasil.textContent = "Hasil Akhir";

    bagianHasil.appendChild(judulHasil);

    let tabelHasil = document.createElement("table");
    tabelHasil.className = "tabel-matriks tabel-hasil";

    hasil.forEach(row => {

        let tr = document.createElement("tr");

        row.forEach((nilai, kolom) => {

            let td = document.createElement("td");

            td.textContent = formatAngka(nilai);

            if (kolom === ukuran) {
                td.className = "kolom-konstanta";
            }

            tr.appendChild(td);
        });

        tabelHasil.appendChild(tr);
    });

    container.appendChild(tabelHasil);bagianHasil.appendChild(tabelHasil);

    // ==========================================
    // MENENTUKAN JENIS SOLUSI
    // ==========================================

    let jenisSolusi = "";

    if (adaKontradiksi) {

        jenisSolusi = "Sistem tidak memiliki solusi.";

    } else if (jumlahPivot === ukuran) {

        jenisSolusi = "Sistem memiliki solusi tunggal.";

    } else {

        jenisSolusi = "Sistem memiliki tak hingga banyak solusi.";
    }


    // ==========================================
    // MENAMPILKAN KESIMPULAN
    // ==========================================

    let kesimpulan = document.createElement("div");
    kesimpulan.className = "kesimpulan";

    let judulKesimpulan = document.createElement("h3");
    judulKesimpulan.textContent = "Kesimpulan Solusi";

    kesimpulan.appendChild(judulKesimpulan);

    // Menampilkan jenis solusi
    let statusSolusi = document.createElement("p");

    statusSolusi.textContent = jenisSolusi;

    kesimpulan.appendChild(statusSolusi);


    // ==========================================
    // SOLUSI TUNGGAL
    // ==========================================

    if (!adaKontradiksi && jumlahPivot === ukuran) {

        for (let i = 0; i < ukuran; i++) {

            let teks = document.createElement("p");

            teks.innerHTML =
                `x<sub>${i + 1}</sub> = ${formatAngka(hasil[i][ukuran])}`;

            kesimpulan.appendChild(teks);
        }
    }


    // ==========================================
    // SOLUSI PARAMETRIK
    // ==========================================

    if (!adaKontradiksi && jumlahPivot < ukuran) {

        let parameter = ["t", "s", "u", "v", "w"];

        let namaParameter = {};

        // Memberikan parameter pada variabel bebas
        variabelBebas.forEach((kolom, index) => {

            namaParameter[kolom] =
                parameter[index] || `t${index + 1}`;
        });

        // Menampilkan variabel bebas
        variabelBebas.forEach(kolom => {

            let teks = document.createElement("p");

            teks.innerHTML =
                `x<sub>${kolom + 1}</sub> = ${namaParameter[kolom]}`;

            kesimpulan.appendChild(teks);
        });

        // Membentuk persamaan variabel pivot
        for (let i = 0; i < kolomPivot.length; i++) {

            let kolom = kolomPivot[i];

            let persamaan = formatAngka(hasil[i][ukuran]);

            for (let j of variabelBebas) {

                let koefisien = -hasil[i][j];

                if (Math.abs(koefisien) > 1e-10) {

                    let tanda = koefisien > 0 ? " + " : " - ";

                    let nilaiKoefisien = Math.abs(koefisien);

let teksKoefisien = nilaiKoefisien === 1
    ? ""
    : formatAngka(nilaiKoefisien);

persamaan +=
    tanda +
    teksKoefisien +
    namaParameter[j];
                }
            }

            let teks = document.createElement("p");

            teks.innerHTML =
                `x<sub>${kolom + 1}</sub> = ${persamaan}`;

            kesimpulan.appendChild(teks);
        }
    }

    let bagianKesimpulan = document.createElement("div");
    bagianKesimpulan.className = "bagian-kesimpulan";
    bagianKesimpulan.appendChild(kesimpulan);
    container.appendChild(bagianLangkah);
    container.appendChild(bagianHasil);
container.appendChild(bagianKesimpulan);
}
