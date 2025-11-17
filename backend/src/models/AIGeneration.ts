import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database/connection';
import Project from './Project';

interface AIGenerationAttributes {
  id: string;
  projectId: string;
  prompt: string;
  response: string;
  modelUsed: string;
  tokensUsed?: number;
  createdAt?: Date;
}

interface AIGenerationCreationAttributes extends Optional<AIGenerationAttributes, 'id' | 'tokensUsed'> {}

class AIGeneration extends Model<AIGenerationAttributes, AIGenerationCreationAttributes> implements AIGenerationAttributes {
  public id!: string;
  public projectId!: string;
  public prompt!: string;
  public response!: string;
  public modelUsed!: string;
  public tokensUsed?: number;
  public readonly createdAt!: Date;
}

AIGeneration.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    projectId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'projects',
        key: 'id',
      },
    },
    prompt: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    response: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    modelUsed: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tokensUsed: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'ai_generations',
    updatedAt: false,
  }
);

// Associations
Project.hasMany(AIGeneration, { foreignKey: 'projectId', as: 'aiGenerations' });
AIGeneration.belongsTo(Project, { foreignKey: 'projectId', as: 'project' });

export default AIGeneration;
