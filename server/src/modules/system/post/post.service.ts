import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { DeleteFlagEnum } from 'src/common/enum';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

import { SysPostEntity } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(@InjectRepository(SysPostEntity) private readonly postRepository: Repository<SysPostEntity>) {}
  create(createPostDto: CreatePostDto) {
    return 'This action adds a new post';
  }

  /**
   * 根据岗位id数组查询岗位信息
   * @param postIds 岗位id数组
   * @returns 岗位id数组对应的岗位对象信息数组
   */
  async findPostByIds(postIds: number[]) {
    return await this.postRepository.find({ where: { postId: In(postIds), delFlag: DeleteFlagEnum.NORMAL } });
  }

  /**
   * @returns 查询所有岗位信息
   */
  async findAll() {
    return await this.postRepository.find({ where: { delFlag: DeleteFlagEnum.NORMAL } });
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
