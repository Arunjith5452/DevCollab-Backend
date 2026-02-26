export class AddCommentDTO {
    userId: string;
    taskId: string;
    message: string;

    constructor(data: { userId: string; taskId: string; message: string }) {
        this.userId = data.userId;
        this.taskId = data.taskId;
        this.message = data.message;
    }
}
