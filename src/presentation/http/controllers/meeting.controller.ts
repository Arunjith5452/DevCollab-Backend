import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { MEETING_TYPES } from "@/infrastructure/di/types/meetings";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { CreateMeetingDTO } from "@/application/dtos/meetings/create-meeting.dto";
import { MeetingEntity } from "@/domain/entities/meeting.entity";
import { successResponse, errorResponse } from "@/shared/utils/response.util";
import { ServerErrorStatus } from "@/domain/enums/status-codes/server-error-status.enum";

import { MeetingListItemDto } from "@/application/dtos/meetings/res/meeting-list-item.dto";

@injectable()
export class MeetingController {
    constructor(
        @inject(MEETING_TYPES.ScheduleMeetingUseCase) private readonly _scheduleMeetingUseCase: IExecute<CreateMeetingDTO, void>,
        @inject(MEETING_TYPES.GetProjectMeetingsUseCase) private readonly _getProjectMeetingsUseCase: IExecute<string, MeetingListItemDto[]>,
        @inject(MEETING_TYPES.UpdateMeetingStatusUseCase) private readonly _updateMeetingStatusUseCase: IExecute<{ meetingId: string, status: string }, void>
    ) { }

    async scheduleMeeting(req: Request, res: Response): Promise<Response> {
        try {
            const createdBy = req.user.userId;

            await this._scheduleMeetingUseCase.execute({
                ...req.body,
                createdBy
            });

            return successResponse(res, "Meeting scheduled successfully");
        } catch (error) {
            return errorResponse(res, "Failed to schedule meeting", ServerErrorStatus.INTERNAL_SERVER_ERROR, error);
        }
    }

    async getProjectMeetings(req: Request, res: Response): Promise<Response> {
        try {
            const { projectId } = req.params;
            const result = await this._getProjectMeetingsUseCase.execute(projectId);

            return successResponse(res, "Meetings fetched successfully", result);
        } catch (error) {
            return errorResponse(res, "Failed to fetch meetings", ServerErrorStatus.INTERNAL_SERVER_ERROR, error);
        }
    }

    async updateMeetingStatus(req: Request, res: Response): Promise<Response> {
        try {
            const { meetingId } = req.params;
            const { status } = req.body;
            await this._updateMeetingStatusUseCase.execute({ meetingId, status });

            return successResponse(res, `Meeting status updated to ${status}`);
        } catch (error) {
            return errorResponse(res, "Failed to update meeting status", ServerErrorStatus.INTERNAL_SERVER_ERROR, error);
        }
    }
}
