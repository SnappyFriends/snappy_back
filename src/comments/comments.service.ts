import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Post } from 'src/posts/entities/post.entity';
import { identity } from 'rxjs';


@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private readonly commentRepository: Repository<Comment>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>
  ) { }

  async createComment(createCommentDto: CreateCommentDto): Promise<Comment> {

    try {
      const userFound = await this.userRepository.findOne({
        where: { id: createCommentDto.user_id }
      });

      if (!userFound) throw new NotFoundException('User not found');

      const postFound = await this.postRepository.findOne({
        where: { post_id: createCommentDto.post_id }
      });

      if (!postFound) throw new NotFoundException('Post not found')

      const comment = this.commentRepository.create({
        user: userFound,
        content: createCommentDto.content,
        postComment: postFound,
        comment_date: new Date()
      });

      return await this.commentRepository.save(comment);
    } catch (error) {
      throw new BadRequestException(
        'Ocurrió un error inesperado al crear un comment. Inténtelo de nuevo.',
      );
    }
  }

  async findAllComments() {
    try {
      const comments = await this.commentRepository.find({
        relations: ['user', 'postComment'],
      });

      const CommentsObject = comments.map((comment) => ({
        ...comment,
        user: {
          id: comment.user.id
        },
        postComment: {
          id: comment.postComment.post_id
        }
      }))
      return CommentsObject;

    } catch (error) {
      throw new BadRequestException(
        'Ocurrió un error inesperado al traer todos los comments. Inténtelo nuevamente.',
      );
    }
  }

  async findOneComment(commentId: string) {
    try {
      const getComment = await this.commentRepository.findOne({
        where: { comment_id: commentId },
        relations: ['user', 'postComment']
      })

      if (!getComment) {
        throw new NotFoundException(`Comment with ${commentId} not Found`)
      }

      const CommentObject = {
        ...getComment,
        user: {
          id: getComment.user.id
        },
        postComment: {
          id: getComment.postComment.post_id
        }
      }
      return CommentObject;

    } catch (error) {
      throw new BadRequestException('Comment not found.');
    }
  }

  async updateComment(updateId: string, updateCommentDto: UpdateCommentDto): Promise<Comment> {
    try {
      const updateComment = await this.commentRepository.findOne({
        where: { comment_id: updateId }
      })

      if (!updateComment) {
        throw new NotFoundException(`The comment with ID ${updateId} does not exist`)
      }
      Object.assign(updateComment, updateCommentDto)
      return await this.commentRepository.save(updateComment)

    } catch (error) {
      throw new NotFoundException(` the comment with ID ${updateId} could not be updated`)
    }

  }

  async deleteComment(commentId: string): Promise<{ message: string }> {
    try {
      const deleteComment = await this.commentRepository.findOne({
        where: { comment_id: commentId }
      })
      if (!deleteComment) {
        throw new BadRequestException('Comment not found.');
      }
      await this.commentRepository.remove(deleteComment)
      return { message: `Comment with id ${commentId} deleted successfully` }
    } catch (error) {
      throw new BadRequestException('Comment not found');
    }

  }
}
