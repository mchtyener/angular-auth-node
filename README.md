# Angular & Node.js OTP Authentication System

## Proje Açıklaması

Bu proje, **Angular** frontend ve **Node.js** backend kullanarak, OTP (One-Time Password) tabanlı bir kullanıcı doğrulama sistemi içermektedir. Sistemde, kayıt olma, giriş yapma, e-posta doğrulama, şifre sıfırlama gibi güvenlik süreçleri gerçekleştirilmiştir. Backend tarafında **Express.js**, e-posta gönderimi için **Nodemailer** kullanılmıştır. Frontend'de ise **Lazy Loading**, **Interceptor** ve **Guards** gibi Angular özellikleriyle kullanıcı yönlendirmeleri yapılmıştır.

### Kullanılan Teknolojiler

- **Angular** (Frontend)
- **Node.js** (Backend)
- **Express.js** (API)
- **Nodemailer** (E-posta gönderimi)
- **JSON Web Tokens (JWT)** (Kimlik doğrulama)
- **MongoDB** (Veritabanı)

## Backend Özellikleri

- **Kayıt Olma (Register)**: Kullanıcıların kayıt olması için OTP doğrulaması kullanılır.
- **Giriş Yapma (Login)**: JWT ile kimlik doğrulaması sağlanır.
- **E-posta Doğrulama (Verify Email)**: Kullanıcılar, e-posta adreslerini doğrulamak için OTP alırlar.
- **Şifre Sıfırlama (Reset Password)**: Şifre unutulduğunda OTP ile şifre sıfırlama işlemi gerçekleştirilir.
- **Şifre Güncelleme (Change Password)**: Kullanıcılar hesapları üzerinden şifrelerini güncelleyebilirler.
- **Çıkış Yapma (Logout)**: Kullanıcı token'ı iptal edilerek güvenli bir çıkış işlemi yapılır.
  
### Backend Yapısı

- **Express.js Middleware**: JWT ile kimlik doğrulama ve yetkilendirme süreçleri için middleware'ler kullanılmıştır.
- **Helpers**: OTP üretme ve e-posta şablonları gibi yardımcı fonksiyonlar yapılandırılmıştır.
- **NodeMailer**: Kullanıcılara OTP ve bilgilendirme e-postaları göndermek için Nodemailer kullanılmıştır. (google üzerinden uygulamanız için uygulama şifresi almanız gerekiyor.)

## Frontend Özellikleri

- **Lazy Loading**: Modüller, kullanıcı deneyimini optimize etmek amacıyla lazy loading ile yüklenmektedir.
- **Token Interceptor**: Backend ile yapılan API isteklerinde, JWT token'ının otomatik olarak eklenmesi için interceptor oluşturulmuştur.
- **Error Interceptor**: API hatalarını yakalayıp, kullanıcıya uygun mesajlar göstermeyi sağlayan error interceptor eklenmiştir.
- **Guards**: Giriş yapılmadan belirli sayfalara erişimi engelleyen Angular guards kullanılmıştır.
  
### Sayfalar

- **Register Page**: Kullanıcı kayıt formu ve OTP doğrulama.
- **Login Page**: Kullanıcı giriş yaptıktan sonra OTP ile doğrulama.
- **Home Page**: Kullanıcı giriş yaptıktan sonra erişebileceği ana sayfa.
- **Profile Page**: Kullanıcı bilgilerini ve şifre değiştirme gibi işlemleri içeren profil sayfası.
- **Forgot Password**: Şifre sıfırlama için e-posta ile OTP gönderimi.
- **Reset Password**: Yeni şifre belirleme sayfası.

## Kurulum

### Backend

1. Depoyu klonlayın:
    ```bash
    git clone https://github.com/kullanici-adi/proje-adi.git
    ```
2. Backend klasörüne gidin:
    ```bash
    cd backend
    ```
3. Gerekli bağımlılıkları yükleyin:
    ```bash
    npm install
    ```
4. Ortam dosyasını (.env) ayarlayın ve gerekli veritabanı, SMTP bilgilerini girin.
5. Sunucuyu başlatın:
    ```bash
    npm start
    ```

### Frontend

1. Frontend klasörüne gidin:
    ```bash
    cd frontend
    ```
2. Gerekli bağımlılıkları yükleyin:
    ```bash
    npm install
    ```
3. Angular uygulamasını başlatın:
    ```bash
    ng serve
    ```

## Lisans

Bu proje MIT lisansı ile lisanslanmıştır.
