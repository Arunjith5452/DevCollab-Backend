import { MeetingEntity } from "@/domain/entities/meeting.entity";
import { IMeetingRepository } from "../interface/meeting.interface";
import { BaseRepository } from "./base.repository";
import { inject, injectable } from "inversify";
import { Model, Types } from "mongoose";
import { MeetingPersistenceMapper } from "@/infrastructure/mappers/meeting-persistence.mapper";
import { MeetingStatus } from "@/domain/enums/meetings/meeting-status.enum";
import { IMeeting } from "../../interface/meeting.interface";

@injectable()
export class MeetingRepository extends BaseRepository<IMeeting> implements IMeetingRepository<MeetingEntity> {
    private readonly meetingPersistenceMapper: MeetingPersistenceMapper;

    constructor(
        @inject("MeetingModel") model: Model<IMeeting>,
        meetingPersistenceMapper: MeetingPersistenceMapper
    ) {
        super(model);
        this.meetingPersistenceMapper = meetingPersistenceMapper;
    }

    async findByProjectId(projectId: string): Promise<MeetingEntity[]> {
        const meetings = await this.model.find({ projectId: new Types.ObjectId(projectId) }).sort({ date: 1 }).lean();
        return meetings.map(meeting => this.meetingPersistenceMapper.fromMongo(meeting));
    }

    async createMeeting(meeting: MeetingEntity): Promise<MeetingEntity> {
        const mongoData = this.meetingPersistenceMapper.toMongo(meeting);
        const createdMeeting = await this.model.create(mongoData);
        return this.meetingPersistenceMapper.fromMongo(createdMeeting);
    }

    async updateStatus(meetingId: string, status: MeetingStatus): Promise<void> {
        await this.model.findByIdAndUpdate(meetingId, { status });
    }
}
