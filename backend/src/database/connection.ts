import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const databaseUrl = process.env.DATABASE_URL || 'sqlite://./database.db';

// Parse SQLite path
const dbPath = databaseUrl.startsWith('sqlite://')
  ? path.resolve(process.cwd(), databaseUrl.replace('sqlite://', ''))
  : databaseUrl;

export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
  },
});

export default sequelize;
