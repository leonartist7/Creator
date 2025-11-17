import { DataTypes, Model, Optional } from 'sequelize';
import bcrypt from 'bcrypt';
import { sequelize } from '../database/connection';

interface UserAttributes {
  id: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  subscriptionTier: 'free' | 'pro' | 'business';
  isEmailVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'subscriptionTier' | 'isEmailVerified'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public email!: string;
  public password!: string;
  public firstName?: string;
  public lastName?: string;
  public subscriptionTier!: 'free' | 'pro' | 'business';
  public isEmailVerified!: boolean;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Instance method to check password
  public async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }

  // Instance method to get safe user data (without password)
  public toSafeObject() {
    return {
      id: this.id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      subscriptionTier: this.subscriptionTier,
      isEmailVerified: this.isEmailVerified,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    subscriptionTier: {
      type: DataTypes.ENUM('free', 'pro', 'business'),
      defaultValue: 'free',
    },
    isEmailVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: 'users',
    hooks: {
      beforeCreate: async (user: User) => {
        if (user.password) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
      beforeUpdate: async (user: User) => {
        if (user.changed('password')) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

export default User;
