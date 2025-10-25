const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Don't include password in queries by default
    },
    profile: {
        firstName: {
            type: String,
            trim: true
        },
        lastName: {
            type: String,
            trim: true
        },
        phone: {
            type: String,
            trim: true
        },
        bio: {
            type: String,
            maxlength: [500, 'Bio cannot exceed 500 characters']
        },
        avatar: {
            type: String // URL to avatar image
        }
    },
    stats: {
        totalScans: {
            type: Number,
            default: 0
        },
        spamDetected: {
            type: Number,
            default: 0
        },
        safeMessages: {
            type: Number,
            default: 0
        },
        suspiciousMessages: {
            type: Number,
            default: 0
        },
        securityScore: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        }
    },
    preferences: {
        theme: {
            type: String,
            enum: ['dark', 'light', 'auto'],
            default: 'dark'
        },
        notifications: {
            email: {
                type: Boolean,
                default: true
            },
            browser: {
                type: Boolean,
                default: true
            }
        },
        privacy: {
            shareStats: {
                type: Boolean,
                default: false
            }
        }
    },
    activity: [{
        type: {
            type: String,
            enum: ['login', 'logout', 'scan', 'report', 'setting_change'],
            required: true
        },
        description: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        ipAddress: String,
        userAgent: String,
        metadata: mongoose.Schema.Types.Mixed
    }],
    lastLogin: {
        type: Date,
        default: Date.now
    },
    loginAttempts: {
        count: {
            type: Number,
            default: 0
        },
        lastAttempt: Date,
        lockedUntil: Date
    },
    isActive: {
        type: Boolean,
        default: true
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: String,
    passwordResetToken: String,
    passwordResetExpires: Date,
    twoFactorEnabled: {
        type: Boolean,
        default: false
    },
    twoFactorSecret: String
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
    return this.name;
});

// Virtual for initials
userSchema.virtual('initials').get(function() {
    const names = this.name.split(' ');
    return names.map(n => n[0]).join('').toUpperCase().substring(0, 2);
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ 'stats.securityScore': -1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();

    try {
        // Hash password with cost of 12
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to increment login attempts
userSchema.methods.incrementLoginAttempts = function() {
    const now = new Date();
    this.loginAttempts.count += 1;
    this.loginAttempts.lastAttempt = now;

    // Lock account after 5 failed attempts for 15 minutes
    if (this.loginAttempts.count >= 5) {
        this.loginAttempts.lockedUntil = new Date(now.getTime() + 15 * 60 * 1000);
    }
};

// Instance method to reset login attempts
userSchema.methods.resetLoginAttempts = function() {
    this.loginAttempts.count = 0;
    this.loginAttempts.lastAttempt = undefined;
    this.loginAttempts.lockedUntil = undefined;
};

// Instance method to check if account is locked
userSchema.methods.isLocked = function() {
    return !!(this.loginAttempts.lockedUntil && this.loginAttempts.lockedUntil > new Date());
};

// Instance method to add activity
userSchema.methods.addActivity = function(type, description, metadata = {}) {
    this.activity.unshift({
        type,
        description,
        timestamp: new Date(),
        metadata
    });

    // Keep only last 100 activities
    if (this.activity.length > 100) {
        this.activity.splice(100);
    }
};

// Static method to find user by email
userSchema.statics.findByEmail = function(email) {
    return this.findOne({ email: email.toLowerCase() });
};

// Static method to get user stats
userSchema.statics.getStats = async function() {
    const stats = await this.aggregate([
        {
            $group: {
                _id: null,
                totalUsers: { $sum: 1 },
                activeUsers: { $sum: { $cond: ['$isActive', 1, 0] } },
                verifiedUsers: { $sum: { $cond: ['$emailVerified', 1, 0] } },
                avgSecurityScore: { $avg: '$stats.securityScore' }
            }
        }
    ]);

    return stats[0] || {
        totalUsers: 0,
        activeUsers: 0,
        verifiedUsers: 0,
        avgSecurityScore: 0
    };
};

module.exports = mongoose.model('User', userSchema);
