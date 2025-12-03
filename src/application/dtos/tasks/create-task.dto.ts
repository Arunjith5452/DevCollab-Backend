import {
    IsString,
    IsOptional,
    IsEnum,
    IsArray,
    IsDateString,
    MinLength,
    MaxLength,
    ValidateNested,
    IsBoolean,
    IsNumber,
    Min,
    ArrayMinSize,
} from "class-validator";
import { Exclude, Expose, Type } from "class-transformer";
import { TaskStatus } from "@/domain/enums/tasks/task-status.enums";

class AcceptanceCriteriaItemDTO {
    @Expose()
    @IsString({ message: "Each acceptance criteria text must be a string" })
    @MinLength(3)
    text!: string;

    @Expose()
    @IsBoolean({ message: "completed must be a boolean" })
    completed!: boolean;
}

class CommentDTO {
    @Expose()
    @IsString({ message: "Comment message must be a string" })
    @MinLength(2, { message: "Comment must be at least 2 characters long" })
    message!: string;

    @Expose()
    @IsString({ message: "User ID must be a string" })
    userId!: string;

    @IsOptional()
    @IsDateString()
    createdAt?: string;
}

class PaymentDTO {
    @Expose()
    @IsNumber({}, { message: 'Advance paid must be a number' })
    @Min(0, { message: 'Advance paid cannot be negative' })
    advancePaid!: number;

    @Expose()
    @IsNumber({}, { message: "Amount must be a valid number" })
    amount!: number;
}

export class CreateTaskDTO {
    @Expose()
    @IsString({ message: "Task title must be a string" })
    @MinLength(3, { message: "Task title must be at least 3 characters long" })
    @MaxLength(50, { message: "Task title cannot exceed 50 characters" })
    title!: string;

    @Expose()
    @IsString({ message: "Project ID is required" })
    projectId!: string;

    @Expose()
    @IsString({ message: "Assignee is required" })
    assignedTo!: string;

    @Expose()
    @IsString({ message: "Description is required" })
    @MinLength(10)
    description!: string

    @Expose()
    @IsOptional()
    @IsString()
    prLink?: string;

    @Expose()
    @IsOptional()
    @IsString()
    feedBack?: string;

    @Expose()
    @IsEnum(TaskStatus, { message: "Invalid status" })
    status!: TaskStatus;

    @Expose()
    @IsDateString({}, { message: "Deadline must be a valid date" })
    deadline!: string;

    @Expose()
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CommentDTO)
    comments?: CommentDTO[];

    @Expose()
    @IsArray()
    @ArrayMinSize(1, { message: "At least one tag is required" })
    @IsString({ each: true })
    tags!: string[];

    @Expose()
    @IsArray({ message: "Acceptance criteria is required" })
    @ArrayMinSize(1, { message: "At least one acceptance criteria is required" })
    @ValidateNested({ each: true })
    @Type(() => AcceptanceCriteriaItemDTO)
    acceptanceCriteria!: AcceptanceCriteriaItemDTO[];

    @Expose()
    @IsOptional()
    @ValidateNested()
    @Type(() => PaymentDTO)
    payment?: PaymentDTO;

    @Expose()
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    documents?: string[];


    // constructor() {
    //     this.title = "";
    //     this.projectId = "";
    //     this.assignedTo = "";
    //     this.description = "";
    //     this.prLink = "";
    //     this.feedBack = "";
    //     this.status = TaskStatus.TODO;
    //     this.deadline = "";
    //     this.comments = [];
    //     this.tags = [];
    //     this.acceptanceCriteria = [];
    //     this.payment = new PaymentDTO(); 
    //     this.documents = [];
    // }

}