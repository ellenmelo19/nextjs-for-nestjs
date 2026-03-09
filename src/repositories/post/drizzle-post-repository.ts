import { PostModel } from '@/src/models/post/post-model';
import { PostRepository } from './post-repository';
import { drizzleDb } from '@/src/db/drizzle';
import { asyncDelay } from '@/src/utils/async-delay';
import { postsTable } from '@/src/db/drizzle/schemas';
import { eq, and, or, ne } from 'drizzle-orm';

const simulateWaitMs = Number(process.env.SIMULATE_WAIT_IN_MS) || 0;

export class DrizzlePostRepository implements PostRepository {
  async findAllPublic(): Promise<PostModel[]> {
    await asyncDelay(simulateWaitMs, true);

    const posts = await drizzleDb.query.posts.findMany({
      orderBy: (posts, { desc }) => desc(posts.createdAt),
      where: (posts, { eq }) => eq(posts.published, true),
    });

    return posts;
  }

  async findBySlugPublic(slug: string): Promise<PostModel> {
    await asyncDelay(simulateWaitMs, true);

    const post = await drizzleDb.query.posts.findFirst({
      where: (posts, { eq, and }) =>
        and(eq(posts.published, true), eq(posts.slug, slug)),
    });

    if (!post) throw new Error('Post não encontrado para slug');

    return post;
  }

  async findAll(): Promise<PostModel[]> {
    await asyncDelay(simulateWaitMs, true);

    const posts = await drizzleDb.query.posts.findMany({
      orderBy: (posts, { desc }) => desc(posts.createdAt),
    });

    return posts;
  }

  async findById(id: string): Promise<PostModel> {
    await asyncDelay(simulateWaitMs, true);

    const post = await drizzleDb.query.posts.findFirst({
      where: (posts, { eq }) => eq(posts.id, id),
    });

    if (!post) throw new Error('Post não encontrado para ID');

    return post;
  }

  async create(post: PostModel): Promise<PostModel> {
    console.log('=== REPOSITORY CREATE ===');
    console.log('Verificando se post já existe...');
    
    const postExists = await drizzleDb.query.posts.findFirst({
      where: (posts, { or, eq }) =>
        or(eq(posts.id, post.id), eq(posts.slug, post.slug)),
      columns: { id: true, slug: true },
    });

    console.log('Post exists check result:', postExists);

    if (!!postExists) {
      console.log('Post já existe!');
      throw new Error(`Post com ID ou Slug já existe na base de dados. ID: ${post.id}, Slug: ${post.slug}`);
    }

    console.log('Tentando inserir no banco...');
    console.log('Dados do post:', post);
    
    try {
      const result = await drizzleDb.insert(postsTable).values(post);
      console.log('Resultado da inserção:', result);
      
      // Verificar se foi inserido
      const insertedPost = await drizzleDb.query.posts.findFirst({
        where: (posts, { eq }) => eq(posts.id, post.id),
      });
      
      console.log('Post inserido (verificação):', insertedPost);
      
      if (!insertedPost) {
        throw new Error('Post não foi inserido (verificação falhou)');
      }
      
      return post;
    } catch (dbError) {
      console.log('Erro no banco de dados:', dbError);
      throw dbError;
    }
  }

  async delete(id: string): Promise<PostModel> {
    const post = await drizzleDb.query.posts.findFirst({
      where: (posts, { eq }) => eq(posts.id, id),
    });

    if (!post) {
      throw new Error('Post não existe');
    }

    await drizzleDb.delete(postsTable).where(eq(postsTable.id, id));

    return post;
  }

  async update(
    id: string,
    newPostData: Partial<Omit<PostModel, 'id' | 'createdAt'>>,
  ): Promise<PostModel> {
    const oldPost = await drizzleDb.query.posts.findFirst({
      where: (posts, { eq }) => eq(posts.id, id),
    });

    if (!oldPost) {
      throw new Error('Post não existe');
    }

    // Verificar se o novo slug já existe em outro post (apenas se foi fornecido e é diferente do antigo)
    if (newPostData.slug && newPostData.slug !== oldPost.slug) {
      const existingPostWithSlug = await drizzleDb.query.posts.findFirst({
        where: (posts, { eq, and }) => 
          and(
            eq(posts.slug, newPostData.slug as string), // Garantir que é string
            ne(posts.id, id) // Não considerar o próprio post
          ),
      });
      
      if (existingPostWithSlug) {
        throw new Error('Já existe outro post com este slug');
      }
    }

    const postData = {
      author: newPostData.author ?? oldPost.author,
      content: newPostData.content ?? oldPost.content,
      coverImageUrl: newPostData.coverImageUrl ?? oldPost.coverImageUrl,
      excerpt: newPostData.excerpt ?? oldPost.excerpt,
      published: newPostData.published ?? oldPost.published,
      title: newPostData.title ?? oldPost.title,
      slug: newPostData.slug ?? oldPost.slug,
      updatedAt: newPostData.updatedAt ?? new Date().toISOString(),
    };

    await drizzleDb
      .update(postsTable)
      .set(postData)
      .where(eq(postsTable.id, id));

    return {
      ...oldPost,
      ...postData,
    };
  }
}