import Admin from '../models/admin.model.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import generateVerificationToken from '../utils/generate-verification-token.js';

const TOKEN_EXPIRATION_TIME = 15 * 60 * 1000; // 15 minutes

const AdminService = {
  async register(username, email, password) {
    const adminExists = await Admin.findOne({ email }).select('_id');

    if (adminExists) {
      throw new Error(
        'An admin with this email already exists. Please use a different email.',
      );
    }

    const admin = new Admin({
      username,
      email,
      password,
      verificationToken: generateVerificationToken(),
      verificationTokenExpiresAt: Date.now() + TOKEN_EXPIRATION_TIME,
    });

    await admin.save();

    return {
      _id: admin._id,
      email: admin.email,
      username: admin.username,
      verificationToken: admin.verificationToken,
    };
  },

  async verifyEmail(code) {
    const admin = await Admin.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    }).select(
      '_id email username isVerified verificationToken verificationTokenExpiresAt',
    );

    if (!admin) {
      throw new Error('Invalid or expired verification code.');
    }

    admin.isVerified = true;
    admin.verificationToken = undefined;
    admin.verificationTokenExpiresAt = undefined;

    await admin.save();

    return { email: admin.email, username: admin.username };
  },

  async login(email, password) {
    const admin = await Admin.findOne({ email }).select(
      '_id username email password isVerified verificationToken verificationTokenExpiresAt',
    );

    if (!admin) {
      throw new Error('Admin not found.');
    }

    if (!admin.isVerified) {
      admin.verificationToken = generateVerificationToken();
      admin.verificationTokenExpiresAt = Date.now() + TOKEN_EXPIRATION_TIME;

      await admin.save();
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials.');
    }

    return {
      _id: admin._id,
      email: admin.email,
      username: admin.username,
      isVerified: admin.isVerified,
      verificationToken: admin.verificationToken,
    };
  },

  async sendPasswordResetLink(email) {
    const admin = await Admin.findOne({ email }).select(
      '_id email resetPasswordToken resetPasswordExpiresAt',
    );

    if (!admin) {
      throw new Error('No admin found with this email.');
    }

    admin.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    admin.resetPasswordExpiresAt = Date.now() + TOKEN_EXPIRATION_TIME;

    await admin.save();

    return { email: admin.email, resetPasswordToken: admin.resetPasswordToken };
  },

  async resetPassword(token, password) {
    const admin = await Admin.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    }).select('_id email password resetPasswordToken resetPasswordExpiresAt');

    if (!admin) {
      throw new Error('Invalid or expired password reset token.');
    }

    admin.password = password;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpiresAt = undefined;

    await admin.save();

    return { email: admin.email };
  },

  async findAdminById(adminId) {
    const admin = await Admin.findById(adminId).select(
      '_id username email isVerified',
    );

    if (!admin) {
      throw new Error('Admin not found.');
    }

    if (!admin.isVerified) {
      throw new Error('Admin is not verified.');
    }

    return { _id: admin._id, username: admin.username, email: admin.email };
  },

  async updateProfile(adminId, username) {
    const admin = await Admin.findById(adminId).select(
      '_id username email isVerified',
    );

    if (!admin) {
      throw new Error('Admin not found.');
    }

    if (!admin.isVerified) {
      throw new Error('Admin is not verified.');
    }

    admin.username = username;

    await admin.save();

    return { _id: admin._id, username: admin.username, email: admin.email };
  },

  async changePassword(adminId, currentPassword, newPassword) {
    const admin = await Admin.findById(adminId).select(
      '_id password isVerified',
    );

    if (!admin) {
      throw new Error('Admin not found.');
    }

    if (!admin.isVerified) {
      throw new Error('Admin is not verified.');
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      admin.password,
    );

    if (!isPasswordValid) {
      throw new Error('Invalid credentials.');
    }

    admin.password = newPassword;

    await admin.save();
  },
};

export default AdminService;
