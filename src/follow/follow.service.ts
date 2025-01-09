import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from './entities/follow.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private readonly followRepository: Repository<Follow>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async followUser(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new BadRequestException('You cannot follow yourself');
    }

    const follower = await this.userRepository.findOne({
      where: { id: followerId },
    });
    const following = await this.userRepository.findOne({
      where: { id: followingId },
    });

    if (!follower || !following) {
      throw new NotFoundException('One or both users do not exist');
    }

    const alreadyFollowing = await this.isFollowing(followerId, followingId);

    if (alreadyFollowing) {
      throw new BadRequestException('You are already following this user');
    }

    const follow = this.followRepository.create({
      follower,
      following,
      createdAt: new Date(),
    });

    await this.followRepository.save(follow);

    return 'Successfully followed the user';
  }

  async unfollowUser(followerId: string, followingId: string): Promise<void> {
    const follower = await this.userRepository.findOne({
      where: { id: followerId },
    });
    const following = await this.userRepository.findOne({
      where: { id: followingId },
    });

    if (!follower || !following) {
      throw new NotFoundException('One or both users do not exist');
    }

    const follow = await this.followRepository.findOne({
      where: { follower: { id: followerId }, following: { id: followingId } },
    });

    if (!follow) {
      throw new BadRequestException('You are not following this user');
    }

    await this.followRepository.delete(follow.id);
  }

  async getFollowers(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const follows = await this.followRepository.find({
      where: { following: { id: userId } },
      relations: ['follower'],
    });

    const objectReturn = follows.map((follow) => {
      return {
        id: follow.follower.id,
        username: follow.follower.username,
        profile_image: follow.follower.profile_image,
        user_type: follow.follower.user_type,
      };
    });

    return objectReturn;
  }

  async getFollowing(userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const follows = await this.followRepository.find({
      where: { follower: { id: userId } },
      relations: ['following'],
    });

    const objectReturn = follows.map((follow) => {
      return {
        id: follow.following.id,
        username: follow.following.username,
        profile_image: follow.following.profile_image,
        user_type: follow.following.user_type,
      };
    });

    return objectReturn;
  }

  async getFriends(userId: string) {
    const followers = await this.getFollowers(userId);
    const following = await this.getFollowing(userId);

    return following.filter((followedUser) =>
      followers.some((follower) => follower.id === followedUser.id),
    );
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const follow = await this.followRepository.findOne({
      where: { follower: { id: followerId }, following: { id: followingId } },
    });

    return !!follow;
  }
}
