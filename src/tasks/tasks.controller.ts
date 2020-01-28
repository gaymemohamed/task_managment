import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../node_modules/@nestjs/passport';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { getFilterTasksDto } from './dto/get-filer-tasks.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { User } from '../auth/user.entity';
import { GetUser } from '../auth/get-user.decorator';



@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    constructor(private tasksServies: TasksService) { }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User,
    )
        : Promise<Task> {
        return this.tasksServies.createTask(createTaskDto, user);
    }

    @Get()
    getTasks(
        @Query(ValidationPipe)
        filterDto: getFilterTasksDto
        , @GetUser() user: User
    ): Promise<Task[]> {
        return this.tasksServies.getAllTasks(filterDto, user);

    }

    @Get('/:id')
    getTaskById(
        @Param('id') id: number,
        @GetUser() user: User
    ): Promise<Task> {
        return this.tasksServies.getTaskById(id, user);
    }

    @Delete('/:id')
    deleteTask(
        @Param('id',ParseIntPipe) id: number,
        @GetUser() user : User
    ): Promise<void> {
        return this.tasksServies.deleteTask(id , user);
    }

    @Patch('/:id/status')
    updateTask(
        @Param('id', ParseIntPipe)id: number,
        @Body('status', TaskStatusValidationPipe)status: TaskStatus,
        @GetUser() user:User
    ): Promise<Task> {
        return this.tasksServies.updateTask(id, status , user);
    }

}
