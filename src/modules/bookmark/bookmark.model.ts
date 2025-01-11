import { Table, Column, DataType, Model } from 'sequelize-typescript';


@Table({
  tableName: 'bookmarks',
  paranoid: true,
  underscored: true, // Enable underscored naming for columns
  timestamps: true, // Enable timestamps (createdAt and updatedAt)
})
export class Bookmark extends Model {
  public static REPOSITORY_NAME = 'BOOKMARK_MODEL';

  @Column({
    field: 'uuid',
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4
  })
  uuid: string;

  @Column({
    field: 'name',
    type: DataType.STRING
  })
  name: string;

  @Column({
    field: 'description',
    type: DataType.STRING
  })
  description: string;

  @Column({
    field: 'link',
    type: DataType.STRING
  })
  link: string;

  @Column({
    field: 'thumbnail_url',
    type: DataType.TEXT
  })
  thumbnailUrl: string;

  @Column({
    field: 'meta',
    type: DataType.TEXT,
  })
  meta: string;

  @Column({
    field: 'tags',
    type: DataType.TEXT,
    get() {
      const rawValue = this.getDataValue('tags');
      return rawValue ? rawValue.split(',').map(tag => tag.trim()) : [];
    },
    set(value: string | string[]) {
      if (Array.isArray(value)) {
        this.setDataValue('tags', value.join(','));
      } else {
        this.setDataValue('tags', value);
      }
    }
  })
  tags: string[];
}
