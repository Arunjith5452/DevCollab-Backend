import { Request, Response } from "express";
import { MESSAGES } from "@/shared/constants/messages";
import { inject, injectable } from "inversify";
import { MEETING_TYPES } from "@/infrastructure/di/types/meetings";
import { IExecute } from "@/application/interface/execute.usecase.interface";
import { CreateMeetingDTO } from "@/application/dtos/meetings/create-meeting.dto";
import { successResponse, errorResponse } from "@/shared/utils/response.util";
import { ServerErrorStatus } from "@/domain/enums/status-codes/server-error-status.enum";

import { MeetingListItemDto } from "@/application/dtos/meetings/res/meeting-list-item.dto";

@injectable()
export class MeetingController {
    constructor(
        @inject(MEETING_TYPES.ScheduleMeetingUseCase) private readonly _scheduleMeetingUseCase: IExecute<CreateMeetingDTO, void>,
        @inject(MEETING_TYPES.GetProjectMeetingsUseCase) private readonly _getProjectMeetingsUseCase: IExecute<{ projectId: string, status?: string, page?: number, limit?: number }, { items: MeetingListItemDto[], total: number }>,
        @inject(MEETING_TYPES.UpdateMeetingStatusUseCase) private readonly _updateMeetingStatusUseCase: IExecute<{ meetingId: string, status: string, endTime?: Date }, void>,
        @inject(MEETING_TYPES.UpdateMeetingNotesUseCase) private readonly _updateMeetingNotesUseCase: IExecute<{ meetingId: string; notes: string; userId?: string; userName?: string }, void>
    ) { }

    /**
     * Schedules a new meeting.
     * @param req - Express request containing meeting details in the body.
     * @param res - Express response object.
     * @returns JSON response with success message.
     */
    async scheduleMeeting(req: Request, res: Response): Promise<Response> {
        try {
            const createdBy = req.user.userId;

            await this._scheduleMeetingUseCase.execute({
                ...req.body,
                createdBy
            });

            return successResponse(res, MESSAGES.MEETING.SUCCESS.SCHEDULED);
        } catch (error) {
            return errorResponse(res, MESSAGES.MEETING.ERROR.SCHEDULE_FAILED, ServerErrorStatus.INTERNAL_SERVER_ERROR, error);
        }
    }

    /**
     * Fetches all meetings for a specific project.
     * @param req - Express request containing projectId in params and operational status in query.
     * @param res - Express response object.
     * @returns JSON list of meetings.
     */
    async getProjectMeetings(req: Request, res: Response): Promise<Response> {
        try {
            const { projectId } = req.params;
            const { status, page, limit } = req.query;

            const result = await this._getProjectMeetingsUseCase.execute({
                projectId,
                status: status as string,
                page: page ? Number(page) : undefined,
                limit: limit ? Number(limit) : undefined
            });

            return successResponse(res, MESSAGES.MEETING.SUCCESS.FETCHED, result);
        } catch (error) {
            return errorResponse(res, MESSAGES.MEETING.ERROR.FETCH_FAILED, ServerErrorStatus.INTERNAL_SERVER_ERROR, error);
        }
    }

    /**
     * Updates the status of a meeting.
     * @param req - Express request containing meetingId in params and new status in body.
     * @param res - Express response object.
     * @returns JSON response with success message.
     */
    async updateMeetingStatus(req: Request, res: Response): Promise<Response> {
        try {
            const { meetingId } = req.params;
            const { status, endTime } = req.body;
            await this._updateMeetingStatusUseCase.execute({ meetingId, status, endTime });

            return successResponse(res, MESSAGES.MEETING.SUCCESS.STATUS_UPDATED);
        } catch (error) {
            return errorResponse(res, MESSAGES.MEETING.ERROR.UPDATE_STATUS_FAILED, ServerErrorStatus.INTERNAL_SERVER_ERROR, error);
        }
    }

    /**
     * Updates the notes of a meeting.
     * @param req - Express request containing meetingId in params and notes in body.
     * @param res - Express response object.
     * @returns JSON response with success message.
     */
    async updateMeetingNotes(req: Request, res: Response): Promise<Response> {
        try {
            const { meetingId } = req.params;
            const { notes } = req.body;
            const { userId, username: userName } = req.user;
            
            if (!userName) {
                console.warn(`[MeetingController] Warning: Missing username in req.user for userId ${userId}`);
            }

            console.log(`[MeetingController] Updating notes for meeting ${meetingId} by ${userName || 'Unknown'}: "${notes?.substring(0, 50)}..."`);
            await this._updateMeetingNotesUseCase.execute({ 
                meetingId, 
                notes, 
                userId, 
                userName: userName || 'Participant' 
            });

            return successResponse(res, "Meeting notes updated successfully");
        } catch (error) {
            return errorResponse(res, "Failed to update meeting notes", ServerErrorStatus.INTERNAL_SERVER_ERROR, error);
        }
    }
}
