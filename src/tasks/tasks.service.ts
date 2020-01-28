import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { getFilterTasksDto } from './dto/get-filer-tasks.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { User } from '../auth/user.entity';
import { userInfo } from 'os';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ) { }


    async createTask(
        createTaskDto: CreateTaskDto,
        user: User
    ): Promise<Task> {
        return this.taskRepository.createTask(createTaskDto, user);
    }

    async getAllTasks(
        filterDto: getFilterTasksDto,
        user: User
    ): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDto, user);
    }
    
    async getTaskById(
        id: number,
        user: User
    ): Promise<Task> {
        let found = await this.taskRepository.findOne({ where: { id, userId: user.id } });
        if (!found) {
            throw new NotFoundException(`the Task with "${id}"  not existing`);
        }
        return found;
    }

    async deleteTask(
        id: number,
        user : User
    ): Promise<void> {
        const found = await this.taskRepository.delete({id , userId : user.id});

        if (!found) {
            throw new NotFoundException(`the Task with "${id}"  not existing`);
        }
    }

    async updateTask(
        id: number,
        status: TaskStatus,
        user: User
    ): Promise<Task> {
        const task = await this.getTaskById(id, user);
        task.status = status;
        await task.save();
        return task;
    }


}
