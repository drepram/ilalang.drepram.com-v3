import Image from "next/image";

const logoUrl = "https://media.kabe.drepram.com/logo.png";

export const revalidate = 300;

export default function TentangPage() {
  return (
    <section className="mx-auto max-w-6xl px-2 sm:px-4">
      <div className="space-y-5 pb-8 pt-5 md:space-y-6 md:pt-6">
        <h1 className="page-title text-[#2f241c]">di antara mutiara</h1>
        <h2 className="-mt-1 text-xl italic leading-relaxed text-[#6a5442] sm:text-2xl">
          Melawan Kekerasan Negara. Mengabadikan Ingatan.
        </h2>

        <div className="flex items-center justify-center py-3 md:py-4">
          <div className="relative overflow-hidden rounded-[1.75rem] border border-[#c9b18a] bg-gradient-to-br from-[#fff9ec] via-[#f8e9c6] to-[#ecd9b1] p-4 shadow-[0_18px_42px_rgba(50,34,16,0.22)]">
            <div className="rounded-2xl border border-[#f8efdc] bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.85),rgba(246,228,188,0.72)_55%,rgba(214,180,121,0.6))] p-4">
              <Image
                src={logoUrl}
                alt="Logo ilalang"
                width={144}
                height={144}
                unoptimized
                className="h-28 w-28 object-contain drop-shadow-[0_6px_12px_rgba(90,57,24,0.35)] sm:h-36 sm:w-36"
              />
            </div>
          </div>
        </div>

        <div className="muted-text space-y-5 text-base leading-8 sm:text-lg">
          <p>
            Apa yang hari ini kita anggap sebagai ilalang, bisa jadi adalah mutiara yang dipaksa
            menguncup. Dalam sejarah sastra Indonesia, ada nama-nama yang sengaja disingkirkan dan
            karyanya dikubur hidup-hidup -- bukan karena tak bernilai, tapi karena <strong>politik
            ingatan</strong> dan represi negara yang membuat para perangkai katanya menjadi pariah,
            bahkan harus terasing puluhan tahun di negeri orang.
          </p>

          <p>
            Situs ini hadir sebagai rumah bagi mereka yang &quot;dilupakan&quot;. Di sini, kami
            menghimpun lebih dari <strong>326 karya</strong> (puisi, cerpen, hingga drama) dari
            sosok seperti <strong>Agam Wispi, Hadi S., Sobron Aidit, Sabar Anantaguna, A.S.
            Dharta, H.R. Bandaharo, F.L. Risakotta, Bakri Siregar, Sugiarti Siswadi, dan Siti
            Rukiah Kertapati</strong>. Mereka adalah bagian dari <strong>Lembaga Kebudajaan Rakjat
            (Lekra)</strong> -- sebuah gerakan budaya yang lahir pada 17 Agustus 1950, namun
            dihancurkan dalam badai kekerasan 1965-1966.
          </p>

          <h3 className="pt-2 text-2xl font-semibold leading-tight text-[#3a2d23]">
            Mengapa Kita Harus Membaca Mereka Lagi?
          </h3>

          <p>
            Karya-karya di situs ini bukan sekadar barisan kata, melainkan <strong>zeitgeist</strong>
            (semangat zaman) yang jujur. Mereka menyuarakan penderitaan rakyat kecil -- kaum tani
            dan nelayan yang dirampas haknya -- yang seringkali tak mampu membela diri di hadapan
            penguasa dan tuan tanah.
          </p>

          <p>
            Menghapus karya-karya ini adalah bentuk <strong>kekerasan budaya</strong> (Herlambang,
            2013) yang dilakukan secara sistematis oleh Orde Baru. Kami ingin memulihkan ingatan
            itu, terutama bagi <strong>Generasi Z</strong>, agar tidak terputus secara spiritual dari
            sejarah bangsanya sendiri. Apa yang dulu dibuang bagai tebu habis sepah, kini kami beri
            tempat yang mulia dan terhormat.
          </p>

          <hr className="border-[#d8c2a1]" />

          <h3 className="text-2xl font-semibold leading-tight text-[#3a2d23]">
            Kerja Kolektif &amp; Arsip
          </h3>

          <p>Proyek ini adalah upaya mandiri yang didukung oleh semangat kawan-kawan:</p>

          <ul className="list-disc space-y-3 pl-6 marker:text-[#9a6a34]">
            <li>
              <strong>Sumber Data:</strong> Dihimpun dari <em>Dokumenter Yayasan Lontar, Inside
              Indonesia, sejarahsosial.org, tribunal1965.org, budidayak.blogspot.com,</em> hingga
              <em> British Library</em>.
            </li>
            <li>
              <strong>Tim Pendukung:</strong> Profil penulis disusun oleh <a href="https://x.com/ChrisWibisana">Chris Wibisana</a>, pengarsipan dibantu oleh <a href="https://x.com/pribumi_merah">Alfian Widi Santoso</a>, dan performa situs dioptimasi oleh <a href="https://x.com/gitcommitsudoku">Urwatil Wutsqo</a>.
            </li>
          </ul>

          <p>
            Situs ini juga terhubung dengan proyek <a href="https://kabe.drepram.com"><strong>Kacabenggala Editions</strong></a>, sebuah upaya merestorasi buku-buku yang
            sudah tidak lagi beredar (<em>out-of-print</em>).
          </p>

          <hr className="border-[#d8c2a1]" />

          <p>
            <strong>Mari Berdiskusi</strong>
            <br />
            Hampir seluruh konten situs ini saya bangun secara mandiri. Jika Anda menemukan
            kesalahan pengetikan atau memiliki masukan, silakan sapa saya di <strong>Twitter/X</strong>{" "}
            (<a href="https://twitter.com/drepram">@drepram</a>). Selamat membaca dan mari
            mengabadikan ingatan.
          </p>
        </div>
      </div>
    </section>
  );
}
