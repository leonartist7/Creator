import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database/connection';

interface StyleProfileAttributes {
  id: string;
  masterwork_id: string;

  avg_sentence_length: number;
  sentence_length_variance: number;
  vocab_complexity: number;
  unique_word_ratio: number;
  avg_paragraph_length: number;
  paragraph_variance: number;
  dialogue_ratio: number;

  flesch_reading_ease: number;
  flesch_kincaid_grade: number;
  tone_score: number;
  sentiment_score: number;

  top_words: string; // JSON string
  top_phrases: string; // JSON string
  common_sentence_patterns: string | null; // JSON string

  confidence_score: number;
  analysis_date: Date;
  analysis_duration_ms: number;

  created_at?: Date;
  updated_at?: Date;
}

interface StyleProfileCreationAttributes extends Optional<StyleProfileAttributes, 'id' | 'common_sentence_patterns' | 'analysis_date' | 'created_at' | 'updated_at'> { }

class StyleProfile extends Model<StyleProfileAttributes, StyleProfileCreationAttributes> implements StyleProfileAttributes {
  public id!: string;
  public masterwork_id!: string;

  public avg_sentence_length!: number;
  public sentence_length_variance!: number;
  public vocab_complexity!: number;
  public unique_word_ratio!: number;
  public avg_paragraph_length!: number;
  public paragraph_variance!: number;
  public dialogue_ratio!: number;

  public flesch_reading_ease!: number;
  public flesch_kincaid_grade!: number;
  public tone_score!: number;
  public sentiment_score!: number;

  public top_words!: string;
  public top_phrases!: string;
  public common_sentence_patterns!: string | null;

  public confidence_score!: number;
  public analysis_date!: Date;
  public analysis_duration_ms!: number;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

StyleProfile.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    masterwork_id: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
      references: {
        model: 'masterworks',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    avg_sentence_length: { type: DataTypes.FLOAT, allowNull: false },
    sentence_length_variance: { type: DataTypes.FLOAT, allowNull: false },
    vocab_complexity: { type: DataTypes.FLOAT, allowNull: false },
    unique_word_ratio: { type: DataTypes.FLOAT, allowNull: false },
    avg_paragraph_length: { type: DataTypes.FLOAT, allowNull: false },
    paragraph_variance: { type: DataTypes.FLOAT, allowNull: false },
    dialogue_ratio: { type: DataTypes.FLOAT, allowNull: false },
    flesch_reading_ease: { type: DataTypes.FLOAT, allowNull: false },
    flesch_kincaid_grade: { type: DataTypes.FLOAT, allowNull: false },
    tone_score: { type: DataTypes.FLOAT, allowNull: false },
    sentiment_score: { type: DataTypes.FLOAT, allowNull: false },
    top_words: { type: DataTypes.TEXT, allowNull: false },
    top_phrases: { type: DataTypes.TEXT, allowNull: false },
    common_sentence_patterns: { type: DataTypes.TEXT, allowNull: true, defaultValue: '[]' },
    confidence_score: { type: DataTypes.INTEGER, allowNull: false },
    analysis_date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    analysis_duration_ms: { type: DataTypes.INTEGER, allowNull: false },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    tableName: 'style_profiles',
    timestamps: true,
    underscored: true,
  }
);

export default StyleProfile;
