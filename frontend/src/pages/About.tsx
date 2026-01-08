import React from 'react';
import styles from './About.module.css';

export const About: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Hakkında</h1>
        
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Ne Yapar?</h2>
          <p className={styles.text}>
            Bu araç, öğrencilerin yazdıkları kodları değerlendirerek eğitici geri bildirim sağlar.
            Amacımız, öğrencilere doğrudan çözümü vermek yerine, <strong>Sokratik yöntemle</strong> 
            düşünmeyi ve kendi çözümlerini geliştirmeyi öğretmektir.
          </p>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Sokratik Yöntem Nedir?</h2>
          <p className={styles.text}>
            Sokratik yöntem, öğrencilere doğrudan cevap vermek yerine, onları düşünmeye sevk eden
            sorular sormayı temel alır. Bu yaklaşım:
          </p>
          <ul className={styles.list}>
            <li>Eleştirel düşünme becerilerini geliştirir</li>
            <li>Derin öğrenmeyi teşvik eder</li>
            <li>Problem çözme yeteneklerini güçlendirir</li>
            <li>Öğrencinin kendi çözümüne ulaşmasını sağlar</li>
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Nasıl Çalışır?</h2>
          <ol className={styles.list}>
            <li>
              <strong>Problem Tanımı:</strong> Çözmek istediğiniz problemi detaylı olarak yazın.
              Girdi/çıktı formatını ve kısıtları belirtin.
            </li>
            <li>
              <strong>Kod Girişi:</strong> Çözüm kodunuzu Python, Java veya C++ dillerinden biriyle yazın.
            </li>
            <li>
              <strong>Değerlendirme:</strong> Sistem kodunuzu analiz eder ve:
              <ul className={styles.nestedList}>
                <li>0-100 arası bir puan verir</li>
                <li>Tespit edilen sorunları listeler</li>
                <li>Sokratik ipuçları sunar (doğrudan çözüm değil!)</li>
              </ul>
            </li>
            <li>
              <strong>İyileştirme:</strong> İpuçlarını kullanarak kodunuzu geliştirin ve tekrar değerlendirin.
            </li>
          </ol>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Önemli Notlar</h2>
          <div className={styles.infoBox}>
            <p className={styles.text}>
              ⚠️ Bu araç, doğrudan kod yazmaz veya tam çözüm sunmaz. Amacı, öğrencilerin
              kendi çözümlerini geliştirmelerine rehberlik etmektir.
            </p>
            <p className={styles.text}>
              💡 Bazen "Önerilen Kod" bölümü görüntülenebilir, ancak bu ikincil bir kaynaktır.
              Öncelik her zaman Sokratik ipuçlarıyla kendi çözümünüzü geliştirmenizdir.
            </p>
            <p className={styles.text}>
              📚 Değerlendirme geçmişiniz yerel olarak (tarayıcınızda) saklanır.
              Son 10 değerlendirmeniz otomatik olarak kaydedilir.
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Desteklenen Diller</h2>
          <div className={styles.languageGrid}>
            <div className={styles.languageCard}>
              <span className={styles.languageIcon}>🐍</span>
              <span className={styles.languageName}>Python</span>
            </div>
            <div className={styles.languageCard}>
              <span className={styles.languageIcon}>☕</span>
              <span className={styles.languageName}>Java</span>
            </div>
            <div className={styles.languageCard}>
              <span className={styles.languageIcon}>⚙️</span>
              <span className={styles.languageName}>C++</span>
            </div>
          </div>
        </section>

        <section className={styles.footer}>
          <p className={styles.footerText}>
            Bu araç, LLM (Büyük Dil Modeli) tabanlı bir eğitim asistanıdır.
            Öğrenme yolculuğunuzda başarılar dileriz! 🚀
          </p>
        </section>
      </div>
    </div>
  );
};
