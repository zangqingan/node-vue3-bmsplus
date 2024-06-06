import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { DeleteFlagEnum } from 'src/common/enum';
import { CreatePostDto, UpdatePostDto, ListPostDto } from './dto';

import { SysPostEntity } from './entities/post.entity';

@Injectable()
export class PostService {
  constructor(@InjectRepository(SysPostEntity) private readonly postRepository: Repository<SysPostEntity>) {}

  /**
   * 新增岗位
   * @param createPostDto
   */
  async create(createPostDto: CreatePostDto) {
    await this.postRepository.save(createPostDto);
    return { message: '新增岗位成功' };
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
  async findAll(query: ListPostDto) {
    const postQueryResult = this.postRepository.createQueryBuilder('post').where('post.delFlag = :delFlag', { delFlag: DeleteFlagEnum.NORMAL });

    if (query.postName) {
      postQueryResult.andWhere(`post.postName LIKE "%${query.postName}%"`);
    }

    if (query.postCode) {
      postQueryResult.andWhere(`post.postCode LIKE "%${query.postCode}%"`);
    }

    if (query.status) {
      postQueryResult.andWhere('post.status = :status', { status: query.status });
    }

    postQueryResult.skip(query.pageSize * (query.pageNum - 1)).take(query.pageSize);
    const [list, total] = await postQueryResult.getManyAndCount();

    return { list, total };
  }

  /**
   * 获取岗位详情
   * @param query
   */
  async findOne(id: number) {
    const res = await this.postRepository.findOne({
      where: {
        postId: id,
        delFlag: DeleteFlagEnum.NORMAL,
      },
    });
    return res;
  }

  /**
   * 更新岗位
   * @param updatePostDto
   */
  async update(updatePostDto: UpdatePostDto) {
    const res = await this.postRepository.update({ postId: updatePostDto.postId }, updatePostDto);
    return res;
  }

  /**
   * 删除岗位
   * @param ids
   */
  async remove(ids: string) {
    const postIds = ids.split(',').map((id) => +id);
    const data = await this.postRepository.update(
      { postId: In(postIds) },
      {
        delFlag: DeleteFlagEnum.DELETE,
      },
    );
    return data;
  }
}
