import { PostRepository } from "./post-repository";
import { DrizzlePostRepository } from './drizzle-post-repository';

export const postRepository: PostRepository = new DrizzlePostRepository();
