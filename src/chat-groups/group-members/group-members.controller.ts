import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  ParseUUIDPipe,
} from '@nestjs/common';
import { GroupMembersService } from '../group-members/group-members.service';
import { CreateGroupMemberDto } from '../dto/create-group-member.dto';
import { UpdateGroupMemberDto } from '../dto/update-group-member.dto';

@Controller('group-members')
export class GroupMembersController {
  constructor(private readonly groupMembersService: GroupMembersService) {}

  @Post()
  create(@Body() createGroupMemberDto: CreateGroupMemberDto) {
    return this.groupMembersService.create(createGroupMemberDto);
  }

  @Get()
  findAll() {
    return this.groupMembersService.findAll();
  }

  @Get(':group_id')
  findOne(@Param('group_id', ParseUUIDPipe) id: string) {
    return this.groupMembersService.findOne(id);
  }

  @Put(':id/role/:group_id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('group_id', ParseUUIDPipe) group_id: string,
    @Body() updateGroupMemberDto: UpdateGroupMemberDto,
  ) {
    return this.groupMembersService.update(id, updateGroupMemberDto, group_id);
  }

  @Put('/requests/:requestId')
  async handleJoinRequest(
    @Param('requestId', ParseUUIDPipe) requestId: string,
    @Body() body: { status: 'ACCEPTED' | 'REJECTED' },
  ) {
    const updatedRequest = await this.groupMembersService.handleJoinRequest(
      requestId,
      body.status,
    );
    return updatedRequest;
  }

  @Put(':id/remove-from-admin')
  removeFromAdmin(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('group_id', ParseUUIDPipe) group_id: string,
  ) {
    return this.groupMembersService.removeFromAdmin(id, group_id);
  }

  @Put(':id/leave')
  async leaveGroup(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('group_id', ParseUUIDPipe) group_id: string,
  ) {
    return this.groupMembersService.leaveGroup(id, group_id);
  }
}
