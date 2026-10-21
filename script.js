/* ---------- HELPER ---------- */
const $ = (selector, parent = document) => parent.querySelector(selector);

const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

/* ---------- ELEMENTS ---------- */
const navbar = $('#navbar');
const hamburger = $('#hamburger');
const navLinks = $('#navLinks');
const progressBar = $('#progressBar');

if (navbar && hamburger && navLinks) {
  /* ---------- SCROLL EFFECT & READING PROGRESS ---------- */
  let ticking = false;

  function updateOnScroll() {
    const scrollY = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

    navbar.classList.toggle('scrolled', scrollY > 40);

    if (progressBar) {
      const progress = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;

      progressBar.style.width = `${Math.min(progress, 100)}%`;
    }

    ticking = false;
  }

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        window.requestAnimationFrame(updateOnScroll);
        ticking = true;
      }
    },
    { passive: true },
  );

  updateOnScroll();

  /* ---------- MOBILE MENU ---------- */
  function closeMenu() {
    navLinks.classList.remove('is-open');
    hamburger.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Buka menu');
  }

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');

    hamburger.classList.toggle('is-open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Tutup menu' : 'Buka menu');
  });

  /* Tutup menu setelah tautan diklik */
  $$('.nav-link, .navbar-cta', navbar).forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  /* Tutup menu saat pengguna menekan Escape */
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  /* Tutup menu saat kembali ke desktop */
  const mobileQuery = window.matchMedia('(max-width: 768px)');

  mobileQuery.addEventListener('change', (event) => {
    if (!event.matches) closeMenu();
  });

  /* ---------- SCROLLSPY ---------- */
  const sections = $$('main section[id]');
  const navAnchors = $$('.nav-link', navbar);

  if ('IntersectionObserver' in window) {
    const spyObserver = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (!visibleSections.length) return;

        const activeId = visibleSections[0].target.id;

        navAnchors.forEach((anchor) => {
          const isActive = anchor.getAttribute('href') === `#${activeId}`;

          anchor.classList.toggle('is-active', isActive);

          if (isActive) {
            anchor.setAttribute('aria-current', 'location');
          } else {
            anchor.removeAttribute('aria-current');
          }
        });
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: [0, 0.1, 0.25, 0.5],
      },
    );

    sections.forEach((section) => spyObserver.observe(section));
  }
}

/* ===== SPORTSAFE: ANIMASI HERO ===== */
(() => {
  const heroVisual = document.querySelector('#heroVisual');

  // Gerakan halus pada visual saat halaman digulir
  window.addEventListener(
    'scroll',
    () => {
      const y = window.scrollY;

      if (heroVisual && y < window.innerHeight) {
        heroVisual.style.transform = `translateY(${y * 0.08}px)`;
      } else if (heroVisual) {
        heroVisual.style.transform = '';
      }
    },
    { passive: true },
  );

  // Animasi elemen saat masuk ke layar
  const revealItems = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('visible'));
  }
})();

/* ========== SPORTSAFE: POPUP ARTIKEL ========== */
/* =========================================================
   SPORTSAFE.ID — ARTIKEL DAN POP-UP PEMBACA ARTIKEL
   ID artikel harus sesuai dengan data-ss-article di HTML:
   warmup, cedera, recovery, cooldown, atlet
   ========================================================= */

('use strict');

/* =========================================================
   1. DATABASE ARTIKEL
   ========================================================= */

const ARTIKEL = {
  warmup: {
    judul: 'Pentingnya Pamanasan Sebelum Olahraga',
    kategori: 'Pamanasan',
    meta: '7 menit baca · Pemula',
    gambar: 'https://images.pexels.com/photos/8084821/pexels-photo-8084821.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    alt: 'Seseorang melakukan peregangan pamanasan di lapangan basket luar ruangan',
    isi: `
      <p>Banyak pemula menganggap pamanasan hanya formalitas yang boleh dilewatkan
      demi menghemat waktu. Padahal pamanasan adalah bagian dari olahraga itu
      sendiri, bukan pelengkap. Artikel ini membahas apa itu pamanasan, manfaatnya,
      jenis-jenisnya, hingga contoh rutinitas 10 menit yang bisa langsung kamu
      praktikkan.</p>

      <h4>Apa itu pamanasan dan mengapa penting?</h4>
      <p>Alodokter menjelaskan pamanasan sebagai serangkaian kegiatan fisik yang
      membantu tubuh lebih siap menjalani olahraga. Gramedia menambahkan bahwa sesi
      olahraga yang baik terdiri atas tiga urutan: pamanasan, latihan inti, dan
      pendinginan — dengan pamanasan dianggap sama pentingnya dengan olahraga inti.
      Sebaliknya, detikHealth mengingatkan bahwa tanpa pamanasan otot cenderung
      tegang sehingga risiko cedera meningkat.</p>

      
<h4>Manfaat pamanasan bagi tubuh</h4>
<ul class="manfaat-list">
  <li><strong>Mengurangi risiko cedera.</strong> Pamanasan memaksimalkan elastisitas otot sehingga otot lebih rileks saat dipakai bergerak (detikHealth).</li>
  <li><strong>Menaikkan suhu tubuh dan otot.</strong> Otot yang hangat lebih siap menerima beban latihan.</li>
  <li><strong>Menstabilkan jantung dan napas.</strong> Pernapasan menjadi lebih dalam dan teratur (Alodokter), detak jantung lebih stabil (detikHealth).</li>
  <li><strong>Memperluas rentang gerak.</strong> Sendi dan otot yang lentur membuat gerakan lebih leluasa saat berolahraga.</li>
  <li><strong>Meningkatkan performa.</strong> Pamanasan dikaitkan dengan peningkatan ketepatan, kecepatan, stamina, dan kelenturan.</li>
  <li><strong>Menyiapkan mental.</strong> Beberapa menit pertama bisa dipakai untuk mengumpulkan fokus sebelum latihan yang lebih berat.</li>
</ul>


      <h4>Jenis-jenis pamanasan</h4>
      <p><strong>Pamanasan dinamis</strong> berupa gerakan aktif yang menyerupai
      olahraga inti, misalnya mengayun kaki, berjalan sambil mengangkat lutut, atau
      squat ringan. Jenis ini menaikkan suhu tubuh sekaligus melatih pola gerak yang
      akan dipakai.</p>
      <p><strong>Pamanasan statis</strong> berupa peregangan yang ditahan beberapa
      saat pada satu posisi. Untuk pemula, peregangan statis sebelum latihan
      sebaiknya singkat dan ringan — peregangan yang lama lebih cocok dilakukan saat
      pendinginan.</p>
      <p>Gramedia juga menyinggung <strong>pamanasan pasif</strong>, yaitu pamanasan
      yang memakai bantuan dari luar tubuh, bukan gerakan aktif. Bagi pemula,
      pamanasan dinamis tetap menjadi pilihan utama yang paling praktis.</p>

      <h4>Contoh rutinitas pamanasan 10 menit</h4>
      <p>Alodokter dan American Heart Association (dikutip Gramedia) sama-sama
      menganjurkan pamanasan sekitar 5–10 menit. Rutinitas berikut dapat dipakai
      sebagai patokan:</p>
      <ol>
  <li><strong>Menit 1–3, kardio ringan:</strong> jalan cepat, jogging pelan, atau jumping jack dengan tempo santai.</li>
  <li><strong>Menit 4–5, putar sendi:</strong> putar leher, bahu, lengan, pinggul, lutut, dan pergelangan kaki — sekitar 10 putaran ke tiap arah.</li>
  <li><strong>Menit 6–8, gerakan dinamis:</strong> leg swing 10 kali per kaki, high knees 20 detik, bodyweight squat 10–12 kali, dan lunges 8 kali per kaki.</li>
  <li><strong>Menit 9–10, tiru olahraga inti:</strong> lakukan gerakan olahragamu dengan intensitas sekitar setengahnya — pelari bisa jogging lalu mempercepat langkah sedikit demi sedikit, peserta latihan beban memakai beban yang sangat ringan.</li>
</ol>

<div class="tip-box green">
  <strong>Tanda pemanasan sudah cukup:</strong>
  tubuh terasa hangat, mulai berkeringat tipis, napas lebih cepat
  tetapi kamu masih bisa berbicara, dan sendi terasa lebih lancar.
  Alodokter juga menyarankan minum air putih saat memanaskan tubuh
  agar kebutuhan cairan tercukupi.
</div>
      
<h4>Kesalahan pamanasan yang sering terjadi</h4>
<ul class="manfaat-list">
  <li><strong>Terlalu singkat.</strong> Hanya beberapa gerakan lalu langsung latihan berat.</li>
  <li><strong>Terlalu berat.</strong> Pamanasan yang melelahkan justru menguras tenaga sebelum latihan inti dimulai.</li>
  <li><strong>Hanya peregangan statis yang lama.</strong> Tubuh belum benar-benar hangat, padahal peregangan lama lebih cocok untuk pendinginan.</li>
  <li><strong>Tidak sesuai jenis olahraga.</strong> Otot yang akan bekerja paling keras perlu mendapat porsi pamanasan paling banyak.</li>
  <li><strong>Memaksakan saat terasa nyeri.</strong> Nyeri tajam saat pamanasan adalah sinyal untuk berhenti dan memeriksakan diri.</li>
  <li><strong>Lupa minum.</strong> Dehidrasi dapat membuat tubuh cepat lelah.</li>
</ul>

<h4>Menyesuaikan pamanasan dengan jenis olahraga</h4>
<ul class="manfaat-list">
  <li><strong>Lari atau jogging:</strong> fokus pada pergelangan kaki, betis, paha, dan pinggul, lalu mulai dengan jogging sangat pelan.</li>
  <li><strong>Bersepeda:</strong> kayuh santai dengan hambatan rendah selama 5–10 menit sambil menggerakkan bahu dan punggung.</li>
  <li><strong>Futsal, basket, atau badminton:</strong> tambahkan gerakan menyamping, lompatan kecil, dan perubahan arah.</li>
  <li><strong>Latihan beban:</strong> lakukan satu atau dua set ringan dari gerakan yang akan dilatih sebelum menambah beban.</li>
</ul>


      
<div class="tip-box ringkasan-box">
  <strong>Ringkasan praktis:</strong>
  sisihkan 5–10 menit untuk pemanasan setiap kali berolahraga,
  pilih pemanasan dinamis sebagai menu utama, naikkan intensitas
  secara bertahap, sesuaikan gerakan dengan olahraga yang akan
  dilakukan, minum air putih sebelum dan selama pemanasan, serta
  hentikan latihan jika muncul nyeri tajam, pusing, atau sesak
  yang tidak biasa.
</div>

<p>
  Pemanasan memakan waktu singkat, tetapi manfaatnya terasa
  sepanjang sesi olahraga. Biasakan sejak awal agar menjadi
  bagian tetap dari rutinitasmu. Jika kamu memiliki penyakit
  jantung, hipertensi, diabetes, atau cedera lama, konsultasikan
  dengan dokter sebelum memulai program olahraga.
</p>

    `,
    sumber:
      'Sumber: <a href="https://www.alodokter.com/karena-belum-pamanasan-jadi-cedera" target="_blank" rel="noopener">Alodokter — Pamanasan sebelum Olahraga, Ini Manfaat dan Cara Melakukannya</a>; <a href="https://health.detik.com/kebugaran/d-6512331/10-manfaat-pamanasan-sebelum-olahraga-dan-gerakannya" target="_blank" rel="noopener">detikHealth — 10 Manfaat Pamanasan Sebelum Olahraga dan Gerakannya</a>; <a href="https://health.detik.com/kebugaran/d-6525969/7-manfaat-pamanasan-sebelum-olahraga-dan-cara-melakukannya" target="_blank" rel="noopener">detikHealth — 7 Manfaat Pamanasan Sebelum Olahraga dan Cara Melakukannya</a>; <a href="https://www.gramedia.com/best-seller/pentingnya-melakukan-pamanasan-sebelum-berolahraga" target="_blank" rel="noopener">Gramedia — Pentingnya Melakukan Pamanasan Sebelum Berolahraga</a>; <a href="https://www.gramedia.com/best-seller/manfaat-pamanasan-sebelum-olahraga" target="_blank" rel="noopener">Gramedia — 4 Manfaat Pamanasan Sebelum Olahraga Penting dan Baik Bagi Tubuh</a>; serta American Heart Association (dikutip Gramedia); jurnal: Fradkin dkk. (2010) dan Behm dkk. (2016) — lihat bagian Referensi.',
  },

  cedera: {
    judul: 'Cedera Olahraga yang Sering Dialami Pemula',
    kategori: 'Pencegahan',
    meta: '8 menit baca · Pemula',
    gambar: 'https://images.unsplash.com/photo-1545463913-5083aa7359a6?crop=entropy&cs=srgb&fm=jpg&q=85',
    alt: 'Terapis menangani kaki yang mengalami cedera olahraga',
    isi: `
      <h4>Apa itu cedera olahraga?</h4>
      <p>Cedera olahraga adalah cedera yang dapat terjadi pada siapa saja — anak
      kecil, orang dewasa, bahkan atlet — saat melakukan kegiatan olahraga.
      Keseleo atau terkilir adalah cedera olahraga yang paling sering terjadi.</p>
      <p>Cedera ini dapat mengenai otot, ligamen, tendon, dan tulang. Berdasarkan
      cara terjadinya, ada dua kelompok: <strong>cedera akut</strong> yang muncul
      tiba-tiba akibat benturan atau gaya berlebih, dan <strong>cedera kronis</strong>
      yang berkembang perlahan karena penggunaan berlebihan atau teknik yang kurang
      tepat. Keduanya membutuhkan penanganan yang berbeda.</p>
      <p>Pada umumnya cedera olahraga terjadi karena tidak melakukan pamanasan
      dengan benar, olahraga berlebihan, dan faktor motorik lainnya. Orang yang
      jarang olahraga dan tidak melakukannya dengan teknik yang benar memiliki
      risiko lebih besar mengalami cedera olahraga.</p>

      <h4>Jenis cedera yang perlu diwaspadai</h4>
      <p>Jenis cedera olahraga yang paling umum meliputi keseleo pergelangan kaki
      (sprain), cedera otot atau tendon (strain), serta cedera lutut — tetapi ada
      banyak jenis lain, bahkan yang sampai membutuhkan tindakan pembedahan atau
      operasi dalam pengobatannya:</p>
      <ol>
        <li><strong>Robekan ACL (ligamen silang depan).</strong> ACL adalah ligamen di lutut dan salah satu cedera lutut yang paling sering dialami atlet. Cedera ini biasanya terjadi pada olahraga dengan gerakan berat seperti sepak bola, basket, dan senam. Cedera ACL tidak sembuh sendiri, sehingga kemungkinan besar memerlukan operasi rekonstruksi ACL — tujuannya antara lain mencegah ketidakstabilan sendi, kerusakan tulang rawan, dan radang sendi pascacedera. Setelah operasi, pasien menjalani fisioterapi.</li>
        <li><strong>Robekan rotator cuff (bahu).</strong> Cedera ini bisa terjadi karena trauma maupun penggunaan berlebihan. Operasi dapat diperlukan jika cedera cukup parah, dan dapat dilakukan lewat bedah terbuka atau artroskopi.</li>
        <li><strong>Robekan meniscus.</strong> Meniskus adalah bantalan tulang rawan di lutut. Robekannya termasuk cedera yang umum membutuhkan bedah olahraga, dan operasinya sering dilakukan dengan pendekatan artroskopi.</li>
      </ol>

      <h4>Mengapa cedera bisa terjadi?</h4>
      <p>Penyebab umumnya meliputi terjatuh, kecelakaan, latihan berlebihan, dan
      keikutsertaan dalam olahraga kontak. Latihan berlebihan tanpa istirahat dan
      pemulihan yang cukup juga sering menjadi penyebab patah tulang stres dan
      cedera akibat penggunaan berlebihan.</p>
      <p>Jenis olahraga juga turut berpengaruh. Sebagian besar cedera olahraga
      paling banyak terjadi saat berolahraga di gym, disusul basket, sepak bola,
      dan olahraga raket. Karena itu, jenis aktivitas yang kamu pilih menentukan
      jenis cedera yang perlu diwaspadai.</p>

      <h4>Strategi pencegahan</h4>
      <p>Tidak ada cara yang menjamin seratus persen bebas cedera. Namun, memahami
      karakteristik, gejala, dan penanganannya dapat membantu meminimalkan risiko.
      Langkah-langkah yang paling sering direkomendasikan:</p>
      <ol>
        <li><strong>Pamanasan dan pendinginan.</strong> Rutinitas pamanasan dan pendinginan yang tepat penting untuk mencegah cedera. Peregangan sebelum berolahraga juga menyiapkan otot dan sendi untuk beraktivitas.</li>
        <li><strong>Peralatan dan teknik yang benar.</strong> Menggunakan perlengkapan dan teknik yang tepat sangat penting. Pada olahraga kontak, teknik yang benar — misalnya tackle dengan kepala tegak di sepak bola Amerika — berpotensi menurunkan risiko cedera.</li>
        <li><strong>Peningkatan beban bertahap.</strong> Sepatu yang baik, latihan silang (cross training), peregangan, dan tidak menaikkan intensitas latihan terlalu cepat adalah langkah pencegahan yang dianjurkan.</li>
        <li><strong>Kenali kondisi tubuh.</strong> Untuk latihan di gym, pencegahan mencakup bersikap realistis terhadap usia, tingkat kebugaran, dan tipe tubuh sebelum memulai latihan. Hindari juga berolahraga saat tubuh lelah dan lemah.</li>
      </ol>

      <h4>Penanganan awal dan pemulihan</h4>
      <p>Untuk cedera ringan, metode <strong>RICE</strong> (istirahat, es, kompresi,
      elevasi) sering efektif mengurangi nyeri dan bengkak. Sumber lain menyebut
      protokol <strong>PRICE</strong>, yaitu perlindungan, istirahat, es, kompresi,
      dan elevasi, dengan periode terpenting pada 24 sampai 48 jam pertama. Setelah
      itu, peregangan ringan dan kembali beraktivitas secara bertahap dapat
      dimulai.</p>
      <div class="tip-box ringkasan-box">
        <strong>Segera periksakan diri bila:</strong> nyeri tajam saat kejadian,
        bengkak parah, tidak bisa menumpu beban, atau gejala tidak membaik.
        Diagnosis dan penanganan dini adalah kunci pemulihan yang baik.
      </div>

      <p>Cedera olahraga memang umum, tetapi sebagian besar tergolong ringan dan
      cepat sembuh. Kuncinya adalah persiapan yang baik — pamanasan, teknik,
      perlengkapan, dan peningkatan beban bertahap. Dengarkan sinyal tubuhmu dan
      jangan tunda memeriksakan diri bila gejala tidak membaik.</p>
    `,
    sumber:
      'Sumber: <a href="https://wakehealth.edu/stories/the-5-most-common-sports-injuries" target="_blank" rel="noopener">Wake Forest Baptist Health</a>, <a href="https://www.yatharthhospitals.com/blogs/sports-injuries-prevention-treatment-options" target="_blank" rel="noopener">Yatharth Hospitals</a>, <a href="https://www.foxnews.com/story/top-10-sports-injuries" target="_blank" rel="noopener">Fox News</a>, <a href="https://www.fortishealthcare.com/blogs/sports-injuries-prevention-and-treatment-options" target="_blank" rel="noopener">Fortis Healthcare</a>, <a href="https://healthtalk.unchealthcare.org/?p=14921" target="_blank" rel="noopener">UNC Health Talk</a>.',
  },

  recovery: {
    judul: 'Recovery dan Istirahat Setelah Latihan',
    kategori: 'Pemulihan',
    meta: '9 menit baca · Pemula',
    gambar: 'https://images.unsplash.com/photo-1761839257789-20147513121a?crop=entropy&cs=srgb&fm=jpg&q=85',
    alt: 'Atlet beristirahat dan memulihkan tenaga di tepi lintasan lari',
    isi: `
      <p>Ketika mulai berolahraga, banyak orang fokus pada latihan yang berat,
      durasi yang panjang, atau jumlah kalori yang terbakar. Namun, ada satu hal
      penting yang sering terlupakan, yaitu <strong>recovery</strong> atau
      pemulihan setelah olahraga. Padahal, proses pemulihan merupakan bagian
      penting dari latihan itu sendiri.</p>
      <p>Bayangkan tubuh seperti baterai ponsel. Setelah digunakan seharian,
      baterai perlu diisi ulang agar dapat berfungsi optimal kembali. Tubuh
      manusia bekerja dengan cara yang mirip: setelah berolahraga, otot,
      persendian, dan sistem energi tubuh membutuhkan waktu untuk memperbaiki
      diri. Jika pemulihan diabaikan, risiko kelelahan, cedera, dan penurunan
      performa akan meningkat.</p>

      <h4>Apa itu recovery?</h4>
      <p>Recovery adalah proses ketika tubuh memperbaiki dan menyesuaikan diri
      setelah menerima beban latihan. Saat berolahraga — terutama dengan
      intensitas sedang hingga tinggi — otot mengalami tekanan dan perubahan
      fisiologis. Tubuh kemudian menggunakan waktu setelah latihan untuk
      memperbaiki jaringan yang rusak, mengembalikan cadangan energi, dan
      mempersiapkan diri menghadapi aktivitas berikutnya.</p>
      <p>Banyak orang menganggap hasil olahraga hanya ditentukan oleh seberapa
      keras mereka berlatih. Faktanya, peningkatan kebugaran justru terjadi
      ketika tubuh beristirahat dan melakukan proses adaptasi setelah latihan.
      Karena itu, recovery sering disebut sebagai bagian dari latihan yang tidak
      boleh dilewatkan.</p>

      <h4>Mengapa recovery penting?</h4>
      <p>Recovery yang baik memberikan banyak manfaat, antara lain:</p>
      <ul class="manfaat-list">
        <li>Mengurangi rasa lelah setelah latihan.</li>
        <li>Membantu perbaikan dan pertumbuhan otot.</li>
        <li>Mengurangi risiko cedera.</li>
        <li>Mengembalikan energi tubuh.</li>
        <li>Menjaga performa latihan berikutnya tetap optimal.</li>
      </ul>
      <div class="tip-box ringkasan-box">
        <strong>Awas overtraining.</strong> Terus berlatih tanpa pemulihan yang
        cukup bisa membuat tubuh kelelahan berlebih. Gejalanya: penurunan
        performa, nyeri berkepanjangan, gangguan tidur, hingga menurunnya
        motivasi untuk berolahraga.
      </div>

      <h4>Langkah-langkah recovery yang benar</h4>
      <ol>
        <li><strong>Pendinginan setelah latihan.</strong> Jangan langsung berhenti — lakukan pendinginan 5–10 menit agar detak jantung turun bertahap dan sirkulasi darah terjaga. Bentuk sederhananya: jalan santai setelah berlari, bersepeda dengan intensitas ringan, atau peregangan ringan pada otot yang baru dipakai. Menurut ACSM, aktivitas ringan setelah latihan membantu mengurangi penumpukan zat sisa metabolisme dan mendukung pemulihan tubuh.</li>
        <li><strong>Minum air yang cukup.</strong> Tubuh kehilangan cairan lewat keringat. Kalau tidak diganti, dehidrasi dapat menyebabkan pusing, penurunan konsentrasi, penurunan performa fisik, dan pemulihan yang lebih lambat. Karena itu, minum air sebelum, selama, dan setelah berolahraga — ACSM menekankan hidrasi sebagai salah satu komponen utama pemulihan.</li>
        <li><strong>Konsumsi makanan bergizi.</strong> Latihan menguras cadangan energi. Contoh makanan pendukung pemulihan: nasi dan lauk berprotein, roti gandum dengan telur, susu rendah lemak, serta buah-buahan seperti pisang atau jeruk. Karbohidrat mengembalikan cadangan energi, sedangkan protein membantu memperbaiki jaringan otot yang rusak selama latihan.</li>
        <li><strong>Tidur yang berkualitas.</strong> Banyak penelitian menunjukkan tidur adalah salah satu faktor pemulihan terpenting. Saat tidur, tubuh memperbaiki jaringan, memulihkan sistem saraf, mengatur hormon, dan memperkuat sistem imun. Kurang tidur memperlambat pemulihan dan meningkatkan risiko cedera.</li>
        <li><strong>Beri waktu istirahat.</strong> Tidak setiap hari harus diisi latihan berat. Hari istirahat bisa berupa <em>complete rest</em> (tidak melakukan aktivitas olahraga berat) atau <em>active recovery</em> (aktivitas ringan seperti jalan santai, yoga, atau bersepeda ringan). Banyak atlet dan pelatih modern justru memasukkan hari pemulihan sebagai bagian dari program latihan.</li>
      </ol>

      <h4>Tanda-tanda tubuh belum pulih</h4>
      <p>Pemula juga perlu mengenali sinyal yang diberikan tubuh. Beberapa tanda
      tubuh belum pulih sepenuhnya:</p>
      <ul class="manfaat-list">
        <li>Nyeri otot yang tidak kunjung hilang.</li>
        <li>Tubuh terasa sangat lelah.</li>
        <li>Sulit tidur.</li>
        <li>Motivasi berolahraga menurun.</li>
        <li>Performa latihan memburuk dibanding biasanya.</li>
      </ul>
      <p>Jika gejala-gejala tersebut muncul, cobalah mengurangi intensitas
      latihan dan berikan waktu pemulihan yang lebih cukup.</p>

      <h4>Kesimpulan</h4>
      <p>Keberhasilan olahraga tidak hanya ditentukan oleh seberapa keras kamu
      berlatih — recovery adalah bagian yang sama pentingnya dengan latihan itu
      sendiri. Pendinginan, hidrasi yang cukup, makanan bergizi, tidur yang
      berkualitas, dan waktu istirahat yang memadai adalah fondasi utama
      pemulihan tubuh.</p>
      <p>Ingatlah: tubuh yang sehat dan bugar dibangun bukan hanya saat berlatih,
      tetapi juga saat pulih dari latihan tersebut.</p>
    `,
    sumber:
      'Referensi: <a href="https://upk.kemkes.go.id" target="_blank" rel="noopener">Kementerian Kesehatan RI — Pentingnya Rehidrasi dan Pemulihan Setelah Olahraga</a>; <a href="https://keslan.kemkes.go.id" target="_blank" rel="noopener">Kementerian Kesehatan RI, Ditjen Kesehatan Lanjutan — Latihan dan Pemulihan Pasien Cedera Olahraga</a>; Kementerian Kesehatan RI, Ditjen Kesehatan Lanjutan — Konsep Terkini dalam Rehabilitasi Cedera Olahraga; <a href="https://ppjp.ulm.ac.id" target="_blank" rel="noopener">Multilateral: Jurnal Pendidikan Jasmani dan Olahraga, Universitas Lambung Mangkurat — Sport Recovery Penunjang Prestasi yang Sering Dilupakan (2023)</a>; <a href="https://scispace.com" target="_blank" rel="noopener">Jurnal Olahraga dan Kesehatan Indonesia (JOKI) — Dampak Active Recovery terhadap Penurunan Denyut Nadi Pasca Aktivitas Olahraga (2025)</a>.',
  },

  cooldown: {
    judul: 'Pamanasan dan Pendinginan: Kunci Performa dan Keselamatan Atlet',
    kategori: 'Performa',
    meta: '6 menit baca · Semua level',
    gambar: 'https://images.unsplash.com/photo-1562771379-eafdca7a02f8?crop=entropy&cs=srgb&fm=jpg&q=85',
    alt: 'Atlet melakukan peregangan pendinginan di lintasan lari',
    isi: `
      <p>Dalam dunia olahraga prestasi, rutinitas latihan tidak hanya mencakup
      sesi inti. Pamanasan (<em>warming-up</em>) dan pendinginan
      (<em>cooling-down</em>) merupakan dua elemen kunci yang sangat menentukan
      kesiapan fisik, efisiensi kinerja, serta proses pemulihan seorang atlet
      (Shellock &amp; Prentice, 1985; Nurhidayat dkk., 2024).</p>

      <h4>Peran kunci pamanasan (warming-up)</h4>
      <p>Pamanasan dirancang untuk mempersiapkan tubuh secara bertahap dari
      kondisi istirahat menuju intensitas aktivitas fisik yang tinggi.
      Pamanasan idealnya menggabungkan aktivitas aerobik ringan (pamanasan
      umum) dan gerakan spesifik cabang olahraga (pamanasan khusus).</p>
      <ul class="manfaat-list">
        <li><strong>Peningkatan suhu otot dan elastisitas.</strong> Pamanasan meningkatkan suhu jaringan tubuh, mempercepat kontraksi otot, dan meningkatkan elastisitas ligamen serta tendon (McGowan dkk., 2015).</li>
        <li><strong>Peningkatan suplai oksigen dan sirkulasi.</strong> Latihan aerobik ringan mempercepat denyut jantung dan aliran darah, sehingga pasokan oksigen ke otot yang bekerja meningkat (Bishop, 2003).</li>
        <li><strong>Pencegahan cedera.</strong> Persiapan otot dan sendi yang memadai secara signifikan menurunkan risiko kram, terkilir (sprain), maupun robekan otot (strain) hingga 50% (Pope dkk., 2000).</li>
        <li><strong>Kesiapan mental.</strong> Pamanasan membantu fokus mental atlet, meningkatkan kewaspadaan sistem saraf, serta mengurangi kecemasan sebelum bertanding (Haff &amp; Triplett, 2015).</li>
      </ul>

      <h4>Peran kunci pendinginan (cooling-down)</h4>
      <p>Pendinginan dilakukan tepat setelah aktivitas inti selesai, ketika
      otot masih dalam keadaan hangat. Sesi ini biasanya melibatkan penurunan
      intensitas secara bertahap — seperti berjalan atau jogging lambat —
      diselingi peregangan statis.</p>
      <ul class="manfaat-list">
        <li><strong>Penurunan denyut jantung dan laktat.</strong> Pendinginan secara bertahap mengembalikan denyut jantung dan tekanan darah ke batas normal serta membantu pembersihan asam laktat dari jaringan otot (Rezki dkk., 2022).</li>
        <li><strong>Mengurangi ketegangan dan nyeri otot (DOMS).</strong> Pendinginan mengurangi kekakuan otot pasca-latihan dan meminimalkan risiko timbulnya <em>Delayed Onset Muscle Soreness</em> (DOMS) — nyeri otot yang biasanya muncul 24–48 jam setelah latihan berat (Nurhidayat dkk., 2024).</li>
        <li><strong>Mencegah penumpukan darah (blood pooling).</strong> Menghentikan aktivitas berat secara mendadak dapat menyebabkan darah menumpuk di ekstremitas bawah yang memicu pusing atau pingsan. Pendinginan menjaga sirkulasi vena tetap lancar (Shellock &amp; Prentice, 1985).</li>
      </ul>

      <h4>Kesimpulan</h4>
      <p>Baik pamanasan maupun pendinginan memiliki landasan fisiologis yang
      sangat kuat. Mengabaikan kedua tahapan ini dapat menurunkan efisiensi
      gerakan, memperlambat pemulihan (recovery), dan memperbesar risiko cedera
      yang berpotensi menghentikan karier seorang atlet (Rahmat dkk., 2025).</p>
    `,
    sumber:
      'Referensi: <a href="https://ojs.unpkediri.ac.id/index.php/abhipraya/article/download/23179/4294" target="_blank" rel="noopener">Nurhidayat dkk. (2024). Optimalisasi Pemahaman Pamanasan dan Pendinginan untuk Mencegah Cedera pada Klub Olahraga (PDF)</a>; <a href="https://jurnal.stokbinaguna.ac.id/index.php/JOK/article/view/4012" target="_blank" rel="noopener">Rahmat dkk. (2025). Efektivitas Pamanasan dan Pendinginan terhadap Pencegahan Cedera pada Atlet Taekwondo</a>; <a href="https://jurnal.univpgri-palembang.ac.id/index.php/dedikasi/article/view/7084" target="_blank" rel="noopener">Rezki dkk. (2022). Pentingnya Aktifitas Pamanasan dan Pendinginan Dalam Berolahraga Pada Guru Olahraga Dayaun</a>. Rujukan tambahan yang dikutip: Shellock &amp; Prentice (1985); Pope dkk. (2000); Bishop (2003); McGowan dkk. (2015); Haff &amp; Triplett (2015).',
  },

  atlet: {
    judul: 'Cedera Olahraga pada Atlet: Penyebab, Penanganan, dan Pencegahan',
    kategori: 'Prestasi',
    meta: '5 menit baca · Atlet',
    gambar: 'https://images.unsplash.com/photo-1649751361457-01d3a696c7e6?crop=entropy&cs=srgb&fm=jpg&q=85',
    alt: 'Dokter memeriksa kaki atlet yang mengalami cedera olahraga',
    isi: `
      <p>Cedera olahraga merupakan masalah yang sering dialami atlet saat latihan
      maupun pertandingan. Cedera dapat mengganggu aktivitas fisik dan menurunkan
      performa atlet. Menurut Setyaningrum (2019), cedera olahraga dapat terjadi
      akibat trauma maupun penggunaan tubuh secara berlebihan.</p>

      <h4>Jenis cedera yang umum dialami atlet</h4>
      <p>Jenis cedera yang umum dialami atlet meliputi cedera otot (strain),
      cedera ligamen, cedera lutut seperti ACL, serta cedera akibat penggunaan
      berlebihan (overuse injury). Secara umum, cedera bisa dikelompokkan
      berdasarkan jaringan yang mengalaminya:</p>
      <ul class="manfaat-list">
        <li><strong>Cedera otot (strain).</strong> Serat otot meregang atau robek akibat gerakan melebihi kemampuannya — sering muncul saat sprint atau loncatan eksplosif.</li>
        <li><strong>Cedera ligamen (sprain).</strong> Ligamen yang menahan sendi meregang berlebihan atau robek, misalnya kaki terkilir saat mendarat.</li>
        <li><strong>Cedera lutut (ACL).</strong> Ligamen silang depan di lutut robek karena perubahan arah mendadak — hampir selalu membutuhkan operasi rekonstruksi dan fisioterapi panjang.</li>
        <li><strong>Cedera penggunaan berlebihan (overuse injury).</strong> Muncul pelan-pelan karena beban berulang tanpa pemulihan cukup, contohnya tendinitis dan stres fraktur.</li>
      </ul>

      <h4>Faktor penyebab cedera pada atlet</h4>
      <p>Menurut sumber yang sama, faktor penyebabnya antara lain:</p>
      <ul class="manfaat-list">
        <li>Beban latihan yang berlebihan.</li>
        <li>Teknik gerakan yang salah.</li>
        <li>Kurang pamanasan.</li>
        <li>Waktu pemulihan yang tidak cukup.</li>
      </ul>

      <h4>Penanganan sesuai tingkat keparahan</h4>
      <p>Penanganan cedera perlu disesuaikan dengan tingkat keparahannya. Atlet
      sebaiknya menghentikan aktivitas yang memperburuk cedera dan mencari
      pemeriksaan medis jika mengalami nyeri berat atau kesulitan bergerak.</p>
      <div class="tip-box ringkasan-box">
        <strong>Prinsip umum penanganan</strong> untuk cedera ringan, hentikan
        latihan lalu lakukan istirahat, kompres dingin, kompresi, dan elevasi.
        Cedera sedang hingga berat — robekan ligamen atau fraktur — butuh
        diagnosis medis, dan penyembuhannya ditempuh lewat program rehabilitasi
        yang teratur sebelum atlet boleh kembali berlatih penuh.
      </div>

      <h4>Mencegah cedera berulang</h4>
      <p>Pencegahan dapat dilakukan melalui pamanasan, teknik olahraga yang
      benar, pengaturan beban latihan, istirahat yang cukup, dan rehabilitasi
      sebelum kembali bertanding. Atlet yang kembali bertanding sebelum
      rehabilitasinya tuntas berisiko mengalami cedera di tempat yang sama —
      itulah mengapa kesabaran dalam pemulihan sama pentingnya dengan kerasnya
      latihan.</p>

      <h4>Kesimpulan</h4>
      <p>Cedera olahraga dapat memengaruhi kesehatan dan prestasi atlet. Oleh
      karena itu, pencegahan, penanganan yang tepat, dan pemulihan yang memadai
      sangat penting untuk mengurangi risiko cedera berulang.</p>
    `,
    sumber:
      'Referensi: <a href="https://doi.org/10.18051/JBiomedKes.2019.v2.39-44" target="_blank" rel="noopener">Setyaningrum, D. A. W. (2019). Cedera olahraga serta penyakit terkait olahraga. Jurnal Biomedika dan Kesehatan, 2(1), 39–44.</a>',
  },
};

/* =========================================================
   2. STYLE POP-UP ARTIKEL
   ========================================================= */

(function buatStyleArtikel() {
  if (document.getElementById('ssArticleReaderStyles')) return;

  const style = document.createElement('style');
  style.id = 'ssArticleReaderStyles';

  style.textContent = `
    #ssArticleReaderModal {
      position: fixed;
      inset: 0;
      z-index: 99999;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: rgba(12, 25, 19, 0.76);
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      box-sizing: border-box;
    }

    #ssArticleReaderModal *,
    #ssArticleReaderModal *::before,
    #ssArticleReaderModal *::after {
      box-sizing: border-box;
    }

    #ssArticleReaderModal.ss-reader-open {
      display: flex;
    }

    #ssArticleReaderModal .ss-reader-panel {
      position: relative;
      width: min(850px, 100%);
      max-height: 90vh;
      overflow-y: auto;
      overscroll-behavior: contain;
      background: #ffffff;
      color: #26352c;
      border-radius: 22px;
      box-shadow: 0 24px 80px rgba(0, 0, 0, 0.3);
      animation: ssReaderAppear 0.25s ease-out;
    }

    #ssArticleReaderModal .ss-reader-close {
      position: sticky;
      top: 14px;
      z-index: 3;
      float: right;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 42px;
      height: 42px;
      margin: 14px 14px -56px 0;
      border: 0;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.96);
      color: #23382c;
      box-shadow: 0 3px 14px rgba(0, 0, 0, 0.16);
      font-size: 29px;
      line-height: 1;
      cursor: pointer;
      transition: background 0.2s, transform 0.2s;
    }

    #ssArticleReaderModal .ss-reader-close:hover {
      background: #e7f3e9;
      transform: rotate(90deg);
    }

    #ssArticleReaderModal .ss-reader-close:focus-visible {
      outline: 3px solid #4a9c68;
      outline-offset: 3px;
    }

    #ssArticleReaderModal .ss-reader-cover {
      display: block;
      width: 100%;
      height: 290px;
      object-fit: cover;
      background: #edf1ed;
    }

    #ssArticleReaderModal .ss-reader-cover[hidden] {
      display: none;
    }

    #ssArticleReaderModal .ss-reader-content {
      padding: 30px clamp(20px, 5vw, 48px) 42px;
      overflow-wrap: anywhere;
    }

    #ssArticleReaderModal .ss-reader-category {
      margin: 0 0 10px;
      color: #388151;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 1.4px;
      text-transform: uppercase;
    }

    #ssArticleReaderModal .ss-reader-title {
      margin: 0 0 12px;
      color: #20392a;
      font-size: clamp(25px, 4vw, 36px);
      line-height: 1.25;
      font-weight: 800;
    }

    #ssArticleReaderModal .ss-reader-meta {
      margin: 0 0 26px;
      padding-bottom: 20px;
      border-bottom: 1px solid #e5ebe6;
      color: #718077;
      font-size: 13px;
    }

    #ssArticleReaderModal .ss-reader-body {
      color: #39473e;
      font-size: 15px;
      line-height: 1.85;
    }

    #ssArticleReaderModal .ss-reader-body p {
      margin: 0 0 18px;
    }

    #ssArticleReaderModal .ss-reader-body h3 {
      margin: 28px 0 12px;
      color: #244c31;
      font-size: 21px;
      line-height: 1.4;
    }

    #ssArticleReaderModal .ss-reader-body h4 {
      margin: 22px 0 8px;
      color: #2c4935;
      font-size: 16px;
    }

    #ssArticleReaderModal .ss-reader-body ul,
    #ssArticleReaderModal .ss-reader-body ol {
      padding-left: 24px;
      margin: 0 0 22px;
    }

    #ssArticleReaderModal .ss-reader-body li {
      margin-bottom: 9px;
      padding-left: 3px;
    }

    #ssArticleReaderModal .ss-reader-body strong {
      color: #263d2d;
    }

    #ssArticleReaderModal .ss-article-tip {
      margin-top: 28px;
      padding: 18px 20px;
      border-left: 4px solid #3e8b56;
      border-radius: 0 12px 12px 0;
      background: #eef7ef;
      color: #304b37;
    }

    #ssArticleReaderModal .ss-reader-sources {
      margin-top: 32px;
      padding-top: 22px;
      border-top: 1px solid #e5ebe6;
    }

    #ssArticleReaderModal .ss-reader-sources > strong {
      display: block;
      margin-bottom: 12px;
      color: #263d2d;
      font-size: 15px;
    }

    #ssArticleReaderModal .ss-reader-sources ul {
      padding-left: 20px;
      margin: 0;
    }

    #ssArticleReaderModal .ss-reader-sources li {
      margin-bottom: 9px;
      line-height: 1.6;
    }

    #ssArticleReaderModal .ss-reader-sources a {
      color: #287342;
      text-decoration: underline;
      text-underline-offset: 3px;
    }

    #ssArticleReaderModal .ss-reader-sources a:hover {
      color: #174e2b;
    }

    @keyframes ssReaderAppear {
      from {
        opacity: 0;
        transform: translateY(12px) scale(0.99);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @media (max-width: 600px) {
      #ssArticleReaderModal {
        padding: 8px;
      }

      #ssArticleReaderModal .ss-reader-panel {
        max-height: 94vh;
        border-radius: 16px;
      }

      #ssArticleReaderModal .ss-reader-cover {
        height: 210px;
      }

      #ssArticleReaderModal .ss-reader-content {
        padding: 24px 20px 30px;
      }

      #ssArticleReaderModal .ss-reader-title {
        font-size: 26px;
      }

      #ssArticleReaderModal .ss-reader-body {
        font-size: 14px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      #ssArticleReaderModal .ss-reader-panel {
        animation: none;
      }

      #ssArticleReaderModal .ss-reader-close {
        transition: none;
      }
    }
  `;

  document.head.appendChild(style);
})();

/* =========================================================
   3. MEMBUAT POP-UP ARTIKEL
   ========================================================= */

(function buatPopupArtikel() {
  // Cegah modal dibuat dua kali.
  if (document.getElementById('ssArticleReaderModal')) return;

  const modal = document.createElement('div');
  modal.id = 'ssArticleReaderModal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'ssReaderTitle');
  modal.setAttribute('aria-hidden', 'true');

  modal.innerHTML = `
    <div class="ss-reader-panel" role="document">

      <button
        class="ss-reader-close"
        type="button"
        aria-label="Tutup artikel"
        title="Tutup artikel"
      >&times;</button>

      <img
        class="ss-reader-cover"
        src=""
        alt=""
      >

      <div class="ss-reader-content">

        <p class="ss-reader-category"></p>

        <h2
          class="ss-reader-title"
          id="ssReaderTitle"
        ></h2>

        <p class="ss-reader-meta"></p>

        <div class="ss-reader-body"></div>

        <div class="ss-reader-sources">
          <strong>Referensi dan sumber</strong>
          <div class="ss-reader-source-content"></div>
        </div>

      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const panel = modal.querySelector('.ss-reader-panel');
  const closeButton = modal.querySelector('.ss-reader-close');
  const cover = modal.querySelector('.ss-reader-cover');
  const category = modal.querySelector('.ss-reader-category');
  const title = modal.querySelector('.ss-reader-title');
  const meta = modal.querySelector('.ss-reader-meta');
  const body = modal.querySelector('.ss-reader-body');
  const sources = modal.querySelector('.ss-reader-source-content');

  let previousFocus = null;
  let previousBodyOverflow = '';

  /* =======================================================
     4. FUNGSI MEMBUKA ARTIKEL
     ======================================================= */

  function bukaArtikel(id) {
    const artikel = ARTIKEL[id];

    if (!artikel) {
      console.warn('SportSafe.id: artikel tidak ditemukan untuk ID:', id);
      return;
    }

    previousFocus = document.activeElement;
    previousBodyOverflow = document.body.style.overflow;

    category.textContent = artikel.kategori || 'Artikel SportSafe.id';
    title.textContent = artikel.judul || 'Artikel';
    meta.textContent = artikel.meta || '';

    body.innerHTML = artikel.isi || '<p>Isi artikel belum tersedia.</p>';

    sources.innerHTML = artikel.sumber || '<p>Referensi belum tersedia.</p>';

    if (artikel.gambar) {
      cover.src = artikel.gambar;
      cover.alt = artikel.alt || artikel.judul || 'Gambar artikel';
      cover.hidden = false;
    } else {
      cover.removeAttribute('src');
      cover.alt = '';
      cover.hidden = true;
    }

    modal.classList.add('ss-reader-open');
    modal.setAttribute('aria-hidden', 'false');

    document.body.style.overflow = 'hidden';

    closeButton.focus();

    // Mulai dari bagian atas setiap kali artikel dibuka.
    panel.scrollTop = 0;
  }

  /* =======================================================
     5. FUNGSI MENUTUP ARTIKEL
     ======================================================= */

  function tutupArtikel() {
    if (!modal.classList.contains('ss-reader-open')) return;

    modal.classList.remove('ss-reader-open');
    modal.setAttribute('aria-hidden', 'true');

    document.body.style.overflow = previousBodyOverflow;

    if (previousFocus && typeof previousFocus.focus === 'function' && document.contains(previousFocus)) {
      previousFocus.focus();
    }
  }

  /* =======================================================
     6. KLIK KARTU ARTIKEL DARI HTML
     ======================================================= */

  document.addEventListener('click', function (event) {
    const tombol = event.target.closest('.ss-card-button[data-ss-article]');

    if (!tombol) return;

    event.preventDefault();

    const idArtikel = tombol.getAttribute('data-ss-article');

    bukaArtikel(idArtikel);
  });

  /* =======================================================
     7. TOMBOL TUTUP
     ======================================================= */

  closeButton.addEventListener('click', tutupArtikel);

  /* =======================================================
     8. KLIK AREA GELAP UNTUK MENUTUP
     ======================================================= */

  modal.addEventListener('click', function (event) {
    if (event.target === modal) {
      tutupArtikel();
    }
  });

  // Klik di dalam panel tidak menutup modal.
  panel.addEventListener('click', function (event) {
    event.stopPropagation();
  });

  /* =======================================================
     9. TOMBOL ESCAPE UNTUK MENUTUP
     ======================================================= */

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && modal.classList.contains('ss-reader-open')) {
      tutupArtikel();
    }
  });
})();

/* ==========================================
   QUIZ INTERAKTIF — PEMANASAN SEBELUM OLAHRAGA
   ========================================== */

/* 1. DATA PERTANYAAN QUIZ */
const QUIZ = [
  {
    tanya: 'Berapa lama pemanasan yang disarankan sebelum olahraga?',
    pilihan: ['1–2 menit, sekadar memberi salam', '5–10 menit sampai tubuh hangat', '30–45 menit sampai kelelahan', 'Tidak perlu, langsung saja'],
    benar: 1,
    penjelasan: 'Pemanasan 5–10 menit membantu menaikkan suhu otot dan menyiapkan tubuh sebelum berolahraga.',
  },
  {
    tanya: 'Mana yang termasuk pemanasan dinamis?',
    pilihan: ['Sentuh ujung kaki sambil diam 30 detik', 'Duduk santai sambil menunggu giliran', 'Lari ringan dan lingkaran lengan', 'Minum air putih 1 gelas'],
    benar: 2,
    penjelasan: 'Pemanasan dinamis melibatkan gerakan aktif, seperti lari ringan, lingkaran lengan, dan squat ringan.',
  },
  {
    tanya: 'Pegal-pegal yang muncul 1–2 hari setelah latihan baru biasanya disebut…',
    pilihan: ['Asam urat', 'Cedera tulang', 'Cedera ligamen', 'DOMS (nyeri otot onset lambat)'],
    benar: 3,
    penjelasan: 'DOMS adalah nyeri otot yang muncul setelah aktivitas fisik yang belum biasa dilakukan.',
  },
  {
    tanya: 'Tindakan pertama yang paling tepat untuk pergelangan kaki terkilir ringan?',
    pilihan: ['Langsung dipijat keras', 'Lanjut lari biar tetap hangat', 'Balut rapat tanpa istirahat', 'Istirahat, kompres dingin, balut ringan, angkat kaki'],
    benar: 3,
    penjelasan: 'Lindungi pergelangan kaki, sesuaikan aktivitas, gunakan kompres dingin, balut dengan nyaman, dan tinggikan kaki.',
  },
  {
    tanya: 'Menurut WHO (2020), dewasa disarankan beraktivitas fisik intensitas sedang minimal…',
    pilihan: ['150 menit per minggu', '30 menit per bulan', '7 jam setiap hari', '500 menit per hari'],
    benar: 0,
    penjelasan: 'WHO merekomendasikan 150–300 menit aktivitas aerobik intensitas sedang per minggu untuk orang dewasa.',
  },
  {
    tanya: 'Mengapa kita harus melakukan pendinginan setelah latihan, bukan langsung berhenti?',
    pilihan: ['Agar otot langsung kedinginan', 'Supaya keringat cepat mengering', 'Membantu tubuh kembali ke kondisi istirahat secara bertahap', 'Karena pendinginan hanya tradisi olahraga'],
    benar: 2,
    penjelasan: 'Pendinginan bertahap membantu menurunkan intensitas aktivitas dan denyut jantung secara perlahan.',
  },
  {
    tanya: 'Menurut Pope dkk. (2000) yang dikutip di artikel ini, pemanasan yang memadai menurunkan risiko kram, terkilir, dan robekan otot hingga…',
    pilihan: ['10%', '25%', '50%', '90%'],
    benar: 2,
    penjelasan: 'Pilihan jawaban mengikuti materi quiz yang kamu gunakan sebelumnya.',
  },
];

/* 2. AMBIL ELEMEN HTML QUIZ */
function initQuiz() {
  const quizBox = document.getElementById('quizBox');
  const quizCount = document.getElementById('quizCount');
  const quizProgressFill = document.getElementById('quizProgressFill');

  // Berhenti jika elemen HTML quiz tidak ditemukan
  if (!quizBox || !quizCount || !quizProgressFill) {
    console.error('Quiz tidak ditemukan. Periksa ID quizBox, quizCount, dan quizProgressFill.');
    return;
  }

  let quizIndex = 0;
  let quizSkor = 0;
  let sudahMenjawab = false;

  /* 3. MULAI / ULANG QUIZ */
  function mulaiQuiz() {
    quizIndex = 0;
    quizSkor = 0;
    sudahMenjawab = false;

    tampilkanPertanyaan();
  }

  /* 4. TAMPILKAN PERTANYAAN */
  function tampilkanPertanyaan() {
    const q = QUIZ[quizIndex];
    const huruf = ['A', 'B', 'C', 'D'];

    sudahMenjawab = false;

    quizCount.textContent = `Pertanyaan ${quizIndex + 1} dari ${QUIZ.length}`;

    quizProgressFill.style.width = `${((quizIndex + 1) / QUIZ.length) * 100}%`;

    quizBox.innerHTML = `
      <h3 class="quiz-question">${q.tanya}</h3>

      <div class="quiz-options">
        ${q.pilihan
          .map(
            (teks, i) => `
          <button
            type="button"
            class="quiz-option"
            data-i="${i}"
          >
            <span class="option-letter">${huruf[i]}</span>
            <span>${teks}</span>
          </button>
        `,
          )
          .join('')}
      </div>

      <div
        class="quiz-feedback"
        id="quizFeedback"
        aria-live="polite"
      ></div>

      <button
        type="button"
        class="btn btn-lime quiz-next"
        id="quizNext"
        hidden
      >
        ${quizIndex === QUIZ.length - 1 ? 'Lihat Hasil' : 'Pertanyaan Berikutnya'}
      </button>
    `;

    // Pasang aksi untuk setiap pilihan jawaban
    quizBox.querySelectorAll('.quiz-option').forEach((tombol) => {
      tombol.addEventListener('click', function () {
        jawabPertanyaan(Number(this.dataset.i));
      });
    });

    // Pasang aksi tombol berikutnya satu kali
    document.getElementById('quizNext').addEventListener('click', lanjutPertanyaan);
  }

  /* 5. PERIKSA JAWABAN */
  function jawabPertanyaan(pilihanUser) {
    if (sudahMenjawab) return;

    sudahMenjawab = true;

    const q = QUIZ[quizIndex];
    const tombol = quizBox.querySelectorAll('.quiz-option');

    const feedback = document.getElementById('quizFeedback');

    const next = document.getElementById('quizNext');

    // Nonaktifkan pilihan setelah dijawab
    tombol.forEach((b) => {
      b.disabled = true;
    });

    // Tandai jawaban yang benar
    tombol[q.benar].classList.add('is-correct');

    if (pilihanUser === q.benar) {
      quizSkor++;
    } else {
      tombol[pilihanUser].classList.add('is-wrong');
    }

    // Tampilkan penjelasan
    if (pilihanUser === q.benar) {
      feedback.textContent = 'Benar! ' + q.penjelasan;
      feedback.classList.add('ok');
    } else {
      feedback.textContent = 'Belum tepat. ' + q.penjelasan;
      feedback.classList.add('no');
    }

    feedback.classList.add('is-visible');

    // Tampilkan tombol lanjut
    next.hidden = false;
  }

  /* 6. PINDAH KE PERTANYAAN BERIKUTNYA */
  function lanjutPertanyaan() {
    if (!sudahMenjawab) return;

    quizIndex++;

    if (quizIndex < QUIZ.length) {
      tampilkanPertanyaan();
    } else {
      tampilkanHasil();
    }
  }

  /* 7. TAMPILKAN HASIL AKHIR */
  function tampilkanHasil() {
    quizProgressFill.style.width = '100%';
    quizCount.textContent = 'Quiz selesai';

    let pesan;

    if (quizSkor === QUIZ.length) {
      pesan = 'Sempurna! Kamu menjawab semua pertanyaan dengan benar. Waktunya bergerak!';
    } else if (quizSkor >= 5) {
      pesan = 'Bagus banget! Coba baca ulang artikelnya agar pemahamanmu semakin mantap.';
    } else {
      pesan = 'Tidak apa-apa, semua orang mulai dari nol. Baca lagi artikelnya, lalu coba lagi!';
    }

    quizBox.innerHTML = `
      <div class="quiz-score">
        <p class="quiz-score-number">
          ${quizSkor}/${QUIZ.length}
        </p>

        <p class="quiz-score-message">
          ${pesan}
        </p>

        <button
          type="button"
          class="btn btn-ghost"
          id="quizRetry"
        >
          Coba Lagi
        </button>
      </div>
    `;

    document.getElementById('quizRetry').addEventListener('click', mulaiQuiz);
  }

  /* 8. JALANKAN QUIZ PERTAMA KALI */
  mulaiQuiz();
}

/* 9. PASTIKAN HTML SUDAH SIAP */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initQuiz);
} else {
  initQuiz();
}

/* ===== KALKULATOR BMI ===== */
(() => {
  const form = document.getElementById('bmiForm');
  const result = document.getElementById('bmiResult');
  const error = document.getElementById('bmiError');
  const tinggiInput = document.getElementById('inputTinggi');
  const beratInput = document.getElementById('inputBerat');

  if (!form || !result || !tinggiInput || !beratInput) return;

  // Pastikan elemen hasil memiliki class CSS yang benar.
  result.classList.add('bmi-result');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const tinggi = Number(tinggiInput.value);
    const berat = Number(beratInput.value);

    const tidakValid = !tinggiInput.value || !beratInput.value || !Number.isFinite(tinggi) || !Number.isFinite(berat) || tinggi < 100 || tinggi > 250 || berat < 25 || berat > 250;

    if (tidakValid) {
      if (error) {
        error.hidden = false;
        error.textContent = 'Masukkan tinggi 100–250 cm dan berat 25–250 kg.';
      }
      return;
    }

    if (error) error.hidden = true;

    const bmi = berat / Math.pow(tinggi / 100, 2);

    let kategori;
    let kelas;

    if (bmi < 18.5) {
      kategori = 'Berat Badan Kurang';
      kelas = 'bmi-cat-kurus';
    } else if (bmi < 25) {
      kategori = 'Berat Badan Normal';
      kelas = 'bmi-cat-normal';
    } else if (bmi < 30) {
      kategori = 'Berat Badan Berlebih';
      kelas = 'bmi-cat-berlebih';
    } else {
      kategori = 'Obesitas';
      kelas = 'bmi-cat-obesitas';
    }

    const posisi = Math.max(0, Math.min(100, ((bmi - 12) / 28) * 100));

    result.innerHTML = `
      <div class="bmi-value-row">
        <span class="bmi-value">${bmi.toFixed(1)}</span>
        <span class="bmi-unit">kg/m²</span>
      </div>

      <span class="bmi-category ${kelas}">
        ${kategori}
      </span>

      <div
        class="bmi-gauge"
        role="img"
        aria-label="Skala BMI dari 12 sampai 40"
      >
        <span
          class="bmi-marker"
          style="left: ${posisi}%"
        ></span>
      </div>

      <div class="bmi-scale">
        <span>12</span>
        <span>18.5</span>
        <span>25</span>
        <span>30</span>
        <span>40</span>
      </div>

      <p class="bmi-hint">
        Angka ini gambaran awal, bukan diagnosis. Untuk program latihan
        yang tepat, konsultasikan dengan tenaga kesehatan atau ahli gizi.
      </p>
    `;
  });
})();

/* ==========================================
   9. FAQ ACCORDION
   ========================================== */

(() => {
  const faqItems = document.querySelectorAll('#faq .faq-item');

  faqItems.forEach((item) => {
    const tombol = item.querySelector('.faq-question');
    const jawaban = item.querySelector('.faq-answer');

    if (!tombol || !jawaban) return;

    // Sinkronkan kondisi awal.
    tombol.setAttribute('aria-expanded', 'false');
    jawaban.style.maxHeight = '0px';

    tombol.addEventListener('click', () => {
      const sedangTerbuka = item.classList.contains('is-open');

      // Tutup semua pertanyaan.
      faqItems.forEach((elemen) => {
        elemen.classList.remove('is-open');

        const btn = elemen.querySelector('.faq-question');
        const isi = elemen.querySelector('.faq-answer');

        if (btn) {
          btn.setAttribute('aria-expanded', 'false');
        }

        if (isi) {
          isi.style.maxHeight = '0px';
        }
      });

      // Buka pertanyaan yang diklik jika sebelumnya tertutup.
      if (!sedangTerbuka) {
        item.classList.add('is-open');
        tombol.setAttribute('aria-expanded', 'true');
        jawaban.style.maxHeight = jawaban.scrollHeight + 'px';
      }
    });
  });

  // Sesuaikan tinggi jawaban ketika ukuran layar berubah.
  window.addEventListener('resize', () => {
    faqItems.forEach((item) => {
      if (!item.classList.contains('is-open')) return;

      const jawaban = item.querySelector('.faq-answer');
      if (jawaban) {
        jawaban.style.maxHeight = jawaban.scrollHeight + 'px';
      }
    });
  });
})();

const backToTop = document.getElementById('backToTop');

backToTop.addEventListener('click', function () {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});

/* ========================================
   SPORTSAFE.ID - SCROLL DAN FOOTER
======================================== */

document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('#navbar');
  const progressBar = document.querySelector('#progressBar');
  const backToTop = document.querySelector('#backToTop');
  const yearElement = document.querySelector('#year');

  // Tahun copyright otomatis
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Tombol kembali ke atas
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  // Perbarui tampilan saat halaman di-scroll
  function updateScroll() {
    const scrollY = window.scrollY;

    // Navbar, jika tersedia
    if (navbar) {
      navbar.classList.toggle('scrolled', scrollY > 40);
    }

    // Progress bar, jika tersedia
    if (progressBar) {
      const doc = document.documentElement;
      const maxScroll = doc.scrollHeight - window.innerHeight;

      const progress = maxScroll > 0 ? Math.min((scrollY / maxScroll) * 100, 100) : 0;

      progressBar.style.width = `${progress}%`;
    }

    // Tombol kembali ke atas muncul setelah 600px
    if (backToTop) {
      backToTop.classList.toggle('is-visible', scrollY > 600);
    }
  }

  window.addEventListener('scroll', updateScroll, {
    passive: true,
  });

  // Atur tampilan awal
  updateScroll();
});
