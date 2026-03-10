import { MeetingRepository } from "@/infrastructure/db/repository/implements/meeting.repository";
import { ScheduleMeetingUseCase } from "@/application/usecases/meetings/implementations/schedule-meeting.usecase";
import { GetProjectMeetingsUseCase } from "@/application/usecases/meetings/implementations/get-project-meetings.usecase";
import { UpdateMeetingStatusUseCase } from "@/application/usecases/meetings/implementations/update-meeting-status.usecase";
import { UpdateMeetingNotesUseCase } from "@/application/usecases/meetings/implementations/update-meeting-notes.usecase";
import { MeetingController } from "@/presentation/http/controllers/meeting.controller";
import { meetingModel } from "@/infrastructure/db/models/meeting.model";
import { Model } from "mongoose";
import { ContainerModule } from "inversify";
import { MEETING_TYPES } from "../../types/meetings";
import { MeetingPersistenceMapper } from "@/infrastructure/mappers/meeting-persistence.mapper";
import { IMeeting } from "@/infrastructure/db/interface/meeting.interface";

export const MeetingModule = new ContainerModule(({ bind }) => {
    bind<MeetingPersistenceMapper>(MeetingPersistenceMapper).toSelf();
    bind<MeetingRepository>(MEETING_TYPES.MeetingRepository).to(MeetingRepository);
    bind<Model<IMeeting>>("MeetingModel").toConstantValue(meetingModel);
    bind<ScheduleMeetingUseCase>(MEETING_TYPES.ScheduleMeetingUseCase).to(ScheduleMeetingUseCase);
    bind<GetProjectMeetingsUseCase>(MEETING_TYPES.GetProjectMeetingsUseCase).to(GetProjectMeetingsUseCase);
    bind<UpdateMeetingStatusUseCase>(MEETING_TYPES.UpdateMeetingStatusUseCase).to(UpdateMeetingStatusUseCase);
    bind<UpdateMeetingNotesUseCase>(MEETING_TYPES.UpdateMeetingNotesUseCase).to(UpdateMeetingNotesUseCase);
    bind<MeetingController>(MeetingController).to(MeetingController);
});
