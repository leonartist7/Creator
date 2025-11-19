import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../database/connection';
import User from './User';

export type ProjectType = 'ebook' | 'course' | 'guide' | 'template' | 'workbook';
export type ProjectStatus = 'draft' | 'in_progress' | 'completed' | 'published';

export interface ProjectContent {
  html?: string;
  [key: string]: any;
}

interface ProjectAttributes {
  id: string;
  userId: string;
  title: string;
  type: ProjectType;
  content: ProjectContent;
  metadata: object;
  status: ProjectStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProjectCreationAttributes extends Optional<ProjectAttributes, 'id' | 'content' | 'metadata' | 'status'> {}

class Project extends Model<ProjectAttributes, ProjectCreationAttributes> implements ProjectAttributes {
  public id!: string;
  public userId!: string;
  public title!: string;
  public type!: ProjectType;
  public content!: ProjectContent;
  public metadata!: object;
  public status!: ProjectStatus;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Project.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('ebook', 'course', 'guide', 'template', 'workbook'),
      allowNull: false,
    },
    content: {
      type: DataTypes.JSON,
      defaultValue: {},
    },
    metadata: {
      type: DataTypes.JSON,
      defaultValue: {},
    },
    status: {
      type: DataTypes.ENUM('draft', 'in_progress', 'completed', 'published'),
      defaultValue: 'draft',
    },
  },
  {
    sequelize,
    tableName: 'projects',
  }
);

// Associations
User.hasMany(Project, { foreignKey: 'userId', as: 'projects' });
Project.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default Project;
