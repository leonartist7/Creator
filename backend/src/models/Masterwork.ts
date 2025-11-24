import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database/connection';

interface MasterworkAttributes {
  id: string;
  user_id: string;
  title: string;
  author: string | null;
  format: 'PDF' | 'EPUB' | 'DOCX' | 'TXT' | 'MD';
  file_size: number;
  file_path: string;
  cover_image_url: string | null;

  page_count: number | null;
  word_count: number;
  language: string;
  publication_date: string | null;
  isbn: string | null;

  custom_tags: string | null; // Stored as JSON string in SQLite
  user_notes: string | null;
  rating: number | null;

  extraction_status: 'pending' | 'processing' | 'completed' | 'failed';
  extraction_error: string | null;
  analysis_status: 'not_started' | 'processing' | 'completed' | 'failed';

  upload_date: Date;
  last_accessed: Date;
  created_at?: Date;
  updated_at?: Date;
}

interface MasterworkCreationAttributes extends Optional<MasterworkAttributes, 'id' | 'author' | 'cover_image_url' | 'page_count' | 'publication_date' | 'isbn' | 'custom_tags' | 'user_notes' | 'rating' | 'extraction_status' | 'extraction_error' | 'analysis_status' | 'upload_date' | 'last_accessed' | 'created_at' | 'updated_at'> { }

class Masterwork extends Model<MasterworkAttributes, MasterworkCreationAttributes> implements MasterworkAttributes {
  public id!: string;
  public user_id!: string;
  public title!: string;
  public author!: string | null;
  public format!: 'PDF' | 'EPUB' | 'DOCX' | 'TXT' | 'MD';
  public file_size!: number;
  public file_path!: string;
  public cover_image_url!: string | null;

  public page_count!: number | null;
  public word_count!: number;
  public language!: string;
  public publication_date!: string | null;
  public isbn!: string | null;

  public custom_tags!: string | null;
  public user_notes!: string | null;
  public rating!: number | null;

  public extraction_status!: 'pending' | 'processing' | 'completed' | 'failed';
  public extraction_error!: string | null;
  public analysis_status!: 'not_started' | 'processing' | 'completed' | 'failed';

  public upload_date!: Date;
  public last_accessed!: Date;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  // Helper to parse tags
  public getTags(): string[] {
    try {
      return this.custom_tags ? JSON.parse(this.custom_tags) : [];
    } catch (e) {
      return [];
    }
  }

  public setTags(tags: string[]) {
    this.custom_tags = JSON.stringify(tags);
  }
}

Masterwork.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    format: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: {
        isIn: [['PDF', 'EPUB', 'DOCX', 'TXT', 'MD']],
      },
    },
    file_size: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    file_path: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    cover_image_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    page_count: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    word_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    language: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'en',
    },
    publication_date: {
      type: DataTypes.STRING, // SQLite stores dates as strings
      allowNull: true,
    },
    isbn: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    custom_tags: {
      type: DataTypes.TEXT, // JSON string
      allowNull: true,
      defaultValue: '[]',
    },
    user_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5,
      },
    },
    extraction_status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'pending',
      validate: {
        isIn: [['pending', 'processing', 'completed', 'failed']],
      },
    },
    extraction_error: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    analysis_status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'not_started',
      validate: {
        isIn: [['not_started', 'processing', 'completed', 'failed']],
      },
    },
    upload_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    last_accessed: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'masterworks',
    timestamps: true,
    underscored: true,
  }
);

export default Masterwork;
