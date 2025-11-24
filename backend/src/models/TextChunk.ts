import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database/connection';

interface TextChunkAttributes {
  id: string;
  masterwork_id: string;
  chunk_index: number;
  text_content: string;
  word_count: number;
  page_number: number | null;
  location_reference: string | null;
  created_at?: Date;
}

interface TextChunkCreationAttributes extends Optional<TextChunkAttributes, 'id' | 'page_number' | 'location_reference' | 'created_at'> { }

class TextChunk extends Model<TextChunkAttributes, TextChunkCreationAttributes> implements TextChunkAttributes {
  public id!: string;
  public masterwork_id!: string;
  public chunk_index!: number;
  public text_content!: string;
  public word_count!: number;
  public page_number!: number | null;
  public location_reference!: string | null;
  public readonly created_at!: Date;
}

TextChunk.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    masterwork_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'masterworks',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    chunk_index: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    text_content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    word_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    page_number: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    location_reference: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'text_chunks',
    timestamps: false, // Only created_at
    underscored: true,
  }
);

export default TextChunk;
