const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const userValidationSchema = require('../validations/userValidation');
const router = express.Router();
const Otp = require('../models/otp');
const tokenBlacklist = require('../models/TokenBlacklist');
const {
  generateOTP,
  sendOTP,
  verifyOtpHelper,
} = require('../services/otpService');
const {
  generateEmailVerificationToken,
  sendVerificationEmail,
  verifyEmailVerificationToken,
} = require('../services/verificationEmailService');

router.post('/logout', async (req, res) => {
  try {
    const authHeader = req.header('Authorization');

    if (!authHeader) {
      return res
        .status(400)
        .json({ message: 'Yetkilendirme başlığı eksik', success: false });
    }

    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      return res.status(400).json({ message: 'Token eksik', success: false });
    }

    await tokenBlacklist.create({ token });
    res.status(200).json({ message: 'Başarıyla çıkış yapıldı', success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Sunucu hatası', success: false });
  }
});

router.post('/register', async (req, res) => {
  const { error } = userValidationSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ message: error.details[0].message, success: false });
  }

  const { firstName, lastName, email, password, confirmPassword, phone } =
    req.body;

  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ message: 'Şifreler uyuşmuyor', success: false });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'Kullanıcı zaten mevcut', success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = generateEmailVerificationToken(email);

    const isEmailSent = await sendVerificationEmail(email, verificationToken);

    if (isEmailSent) {
      const user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone,
        role: 'user',
      });

      await user.save();

      return res.status(200).json({
        success: true,
        message: 'Kayıt başarılı, lütfen e-posta adresinizi doğrulayın.',
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Doğrulama e-postası gönderilemedi. Lütfen tekrar deneyin.',
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Sunucu hatası', success: false });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: 'Geçersiz giriş bilgileri', success: false });
    }

    if (!user.isEmailVerified) {
      return res
        .status(400)
        .json({ message: 'E-posta doğrulanmamış', success: false });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: 'Geçersiz giriş bilgileri', success: false });
    }

    const otp = generateOTP();

    await Otp.deleteOne({ email });

    const newOtp = new Otp({
      email,
      otp,
      expiresAt: Date.now() + 1 * 60 * 1000,
    });

    await newOtp.save();

    await sendOTP(email, otp);

    res
      .status(200)
      .json({ message: 'OTP e-postanıza gönderildi', success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Sunucu hatası', success: false });
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: 'Bu e-posta ile kayıtlı bir kullanıcı bulunamadı',
        success: false,
      });
    }

    const otp = generateOTP();

    const newOtp = new Otp({
      email,
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    await newOtp.save();

    await sendOTP(email, otp);

    res
      .status(200)
      .json({ message: 'OTP e-posta adresinize gönderildi', success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Sunucu hatası', success: false });
  }
});

router.post('/verify-otp', async (req, res) => {
  const { email, otp, type } = req.body;

  try {
    const result = await verifyOtpHelper(email, otp);

    console.log(result, 5555);

    if (result.error) {
      return res.status(400).json({ message: result.error, success: false });
    }

    const { token, user } = result;

    if (type === 'login') {
      res.status(200).json({
        token,
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        success: true,
      });
      await Otp.deleteOne({ email });
    } else {
      res.status(200).json({
        message: 'Şifre Sıfırlama Otp Kodu Başarılı',
        success: true,
      });
      await Otp.deleteOne({ email });
    }
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', success: false });
  }
});

router.post('/reset-password', async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ message: 'Şifreler uyuşmuyor', success: false });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ message: 'Kullanıcı bulunamadı', success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    await user.save();

    res
      .status(200)
      .json({ message: 'Şifre başarıyla güncellendi', success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Sunucu hatası', success: false });
  }
});

router.get('/verify-email/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const isBlacklisted = await tokenBlacklist.findOne({ token });

    if (isBlacklisted) {
      return res.status(400).json({
        message: 'Token zaten kullanıldı veya geçersiz',
        success: false,
      });
    }

    const email = await verifyEmailVerificationToken(token);

    if (!email) {
      return res
        .status(400)
        .json({ message: 'Geçersiz veya süresi dolmuş token', success: false });
    }

    const user = await User.findOneAndUpdate(
      { email },
      { isEmailVerified: true },
      { new: true }
    );

    if (!user) {
      return res
        .status(400)
        .json({ message: 'Kullanıcı bulunamadı', success: false });
    }

    await tokenBlacklist.create({ token });

    res
      .status(200)
      .json({ message: 'E-posta başarıyla doğrulandı', success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Sunucu hatası', success: false });
  }
});

module.exports = router;
