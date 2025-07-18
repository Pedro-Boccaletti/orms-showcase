export type UpdateDto<T> = Partial<Omit<T, 'id'>> & { id: string };
