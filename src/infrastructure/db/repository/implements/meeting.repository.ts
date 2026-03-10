
import { MeetingEntity, ParticipantNote } from "@/domain/entities/meeting.entity";
import { IMeetingRepository } from "@/domain/repository/meeting.interface";
import { BaseRepository } from "./base.repository";
import { inject, injectable } from "inversify";
import { Model, Types, FilterQuery } from "mongoose";
import { MeetingPersistenceMapper } from "@/infrastructure/mappers/meeting-persistence.mapper";
import { MeetingStatus } from "@/domain/enums/meetings/meeting-status.enum";
import { IMeeting } from "../../interface/meeting.interface";

@injectable()
export class MeetingRepository extends BaseRepository<MeetingEntity, IMeeting> implements IMeetingRepository<MeetingEntity> {

    constructor(
        @inject("MeetingModel") model: Model<IMeeting>,
        @inject(MeetingPersistenceMapper) mapper: MeetingPersistenceMapper
    ) {
        super(model, mapper);
    }

    async findByProjectId(projectId: string): Promise<MeetingEntity[]> {
        const meetings = await this.model.find({ projectId: new Types.ObjectId(projectId) })
            .populate("createdBy", "name")
            .sort({ date: -1 })
            .lean();
        return meetings.map(meeting => this.mapper.fromMongo(meeting as unknown as IMeeting));
    }

    async createMeeting(meeting: MeetingEntity): Promise<MeetingEntity> {
        return this.create(meeting);
    }

    async updateStatus(meetingId: string, status: MeetingStatus, endTime?: Date): Promise<void> {
        const updateData: { status: MeetingStatus; endTime?: Date } = { status };
        if (endTime) {
            updateData.endTime = endTime;
        }
        await this.update(meetingId, updateData);
    }

    async updateNotes(meetingId: string, notes: ParticipantNote[] | string): Promise<void> {
        let notesData;
        if (Array.isArray(notes)) {
            notesData = notes;
        } else {
            // Convert legacy notes to array format to satisfy the schema
            // We attribute to creator as a fallback
            const meeting = await this.model.findById(meetingId);
            notesData = [{ 
                userId: meeting?.createdBy || new Types.ObjectId().toString(), 
                userName: 'Creator', 
                content: notes 
            }]; 
        }
        await this.update(meetingId, { notes: notesData });
    }

    async updateParticipantNote(meetingId: string, userId: string, userName: string, content: string): Promise<void> {
        // Atomic update to participant's note section
        const existingMeeting = await this.model.findOne({
            _id: new Types.ObjectId(meetingId),
            "notes.userId": new Types.ObjectId(userId)
        });

        if (existingMeeting) {
            await this.model.updateOne(
                { _id: new Types.ObjectId(meetingId), "notes.userId": new Types.ObjectId(userId) },
                { $set: { "notes.$.content": content, "notes.$.userName": userName } }
            );
        } else {
            await this.model.updateOne(
                { _id: new Types.ObjectId(meetingId) },
                { $push: { notes: { userId: new Types.ObjectId(userId), userName, content } } }
            );
        }
    }

    async findByProjectIdAndStatus(projectId: string, status?: string, page: number = 1, limit: number = 10): Promise<{ items: MeetingEntity[], total: number }> {
        const query: FilterQuery<IMeeting> = { projectId: new Types.ObjectId(projectId) };

        if (status) {
            const statusArray = status.split(',').map(s => s.trim());
            query.status = { $in: statusArray };
        }

        const skip = (page - 1) * limit;

        const [meetings, total] = await Promise.all([
            this.model.find(query)
                .populate("createdBy", "name")
                .sort({ date: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            this.model.countDocuments(query)
        ]);

        return {
            items: meetings.map(meeting => this.mapper.fromMongo(meeting as unknown as IMeeting)),
            total
        };
    }

}
