code-review-ai — Branch Kullanım ve PR Rehberi

Bu kısa döküman, code-review-ai projesindeki 6 ana branch’in kullanım amacını ve Pull Request (PR) sürecini açıklamak için hazırlanmıştır.

⸻

🔱 Branch Özeti ve Kullanım Amacı

1. main
	•	Projenin stabil, test edilmiş ve yayınlanmaya hazır versiyonunu içerir.
	•	Doğrudan geliştirme yapılmaz.
	•	Diğer branch’lerden onaylanmış PR’lar buraya birleştirilir.

2. backend-api
	•	Backend servisleri, API endpoint’leri ve veritabanı işlemleri bu dalda geliştirilir.
	•	Flask/FastAPI tabanlı servisler, authentication, data servisleri vb. burada bulunur.
	•	PR’lar doğrudan main’e değil, bu branch’e açılmalıdır.

3. ai-evaluation
	•	Büyük dil modelleri (LLM) ile yapılan kod değerlendirmeleri, prompt deneyleri ve model analizleri bu branch altında yürütülür.
	•	GPT veya benzeri modellerden gelen sonuçların değerlendirilmesi, karşılaştırmalar ve analiz scriptleri burada yer alır.

4. frontend-ui
	•	Uygulamanın arayüz kısmı (React, Next.js vb.) bu dalda geliştirilir.
	•	Görselleştirmeler, kullanıcı arayüzleri, PR karşılaştırma ekranları gibi bileşenler burada tutulur.

5. data-pipeline
	•	GitHub PR verilerinin toplanması, temizlenmesi ve analiz için hazırlanması işlemleri bu dalda yapılır.
	•	ETL scriptleri, veri dönüştürme süreçleri ve veri seti oluşturma kodları bu branch’e aittir.

6. docs-research
	•	Makale taslakları, literatür özetleri, deney sonuç raporları gibi araştırma içerikleri burada bulunur.
	•	Akademik çıktıların hazırlanması ve sonuç değerlendirmeleri bu dalda tutulur.

⸻

🔁 PR (Pull Request) Süreci
	1.	Her yeni geliştirme, ilgili alanın branch’inden türetilen bir alt branch üzerinde yapılır.
	•	Örnek: feature/api-auth → backend-api tabanlı.
	2.	Geliştirme tamamlandıktan sonra değişiklikler commit edilir ve remote branch’e gönderilir.
	3.	GitHub üzerinden PR açılır.
	•	Base (hedef) branch, hangi bölümle ilgiliyse o olmalıdır.
	•	Örnek: Backend değişikliği için base = backend-api.
	4.	PR açıklamasında şu bilgiler yer almalıdır:
	•	Yapılan değişikliğin özeti
	•	Neden gerekli olduğu
	•	Test veya doğrulama adımları
	5.	PR en az bir ekip üyesi tarafından gözden geçirilir.
	6.	Onay alındıktan ve testler geçtiğinde, değişiklikler base branch’e merge edilir.
	7.	Gerekirse entegrasyon testlerinden sonra main branch’e merge yapılır.

⸻

✅ PR Şablonu (Kısa Örnek)

### Değişiklik Özeti
Kısaca ne geliştirildi?

### Neden Bu Değişiklik Gerekli?
Amacı açıklayın.

### Test Adımları
1. ...
2. ...

### Checklist
- [ ] Kod lint ve testlerden geçti
- [ ] İlgili dokümantasyon güncellendi
- [ ] PR gözden geçirildi


⸻

🔒 Önerilen Kural

main branch korumalı olmalı: PR incelemesi, test geçişi ve en az 1 onay gerektirmelidir.

⸻

Sonuç:
Bu yapı sayesinde her ekip üyesi, kendi alanındaki branch üzerinde izole biçimde çalışabilir. PR süreci, değişikliklerin güvenli, izlenebilir ve düzenli şekilde main branch’e aktarılmasını sağlar.
