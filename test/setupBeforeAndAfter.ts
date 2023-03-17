import { createConnection, getConnection, getRepository } from 'typeorm';
import dataSourceOptions from 'src/database/data-source';

export function setupBeforeAndAfter() {
  beforeAll(async () => {
    return createConnection({
      ...dataSourceOptions,
    });
  });

  beforeEach(async () => {
    const entities = getConnection().entityMetadatas;
    entities.forEach(async (entity) => {
      await getRepository(entity.tableName).delete({});
    });
  });

  afterEach(async () => {
    const entities = getConnection().entityMetadatas;
    entities.forEach(async (entity) => {
      await getRepository(entity.tableName).delete({});
    });
  });

  afterAll(() => {
    const conn = getConnection();
    return conn.close();
  });
}
