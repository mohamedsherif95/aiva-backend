import { Repository, EntityRepository, EntityTarget, getRepository } from 'typeorm';

export abstract class BaseRepository<T> extends Repository<T> {
  constructor(private entity: EntityTarget<T>) {
    super(
      entity,
      getRepository(entity).manager,
      getRepository(entity).queryRunner,
    );
  }
}
