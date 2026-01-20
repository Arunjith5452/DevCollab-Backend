import { IsEnum, IsISO8601, IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";
import { Expose } from "class-transformer";
import { MeetingStatus } from "@/domain/enums/meetings/meeting-status.enum";

export class CreateMeetingDTO {
    @Expose()
    @IsString()
    @IsNotEmpty()
    public readonly projectId: string;

    @Expose()
    @IsString()
    @IsNotEmpty()
    public readonly title: string;

    @Expose()
    @IsISO8601()
    public readonly date: string;

    @Expose()
    @IsString()
    @IsOptional()
    public readonly createdBy?: string;

    @IsString()
    @IsOptional()
    public readonly link?: string;

    @Expose()
    @IsEnum(["single", "group"])
    public readonly type: "single" | "group" = "group";

    constructor(data: {
        projectId?: string,
        title?: string,
        date?: string,
        createdBy?: string,
        link?: string,
        type?: "single" | "group"
    }) {
        this.projectId = data?.projectId || "";
        this.title = data?.title || "";
        this.date = data?.date || "";
        this.createdBy = data?.createdBy || "";
        this.link = data?.link || "";
        this.type = data?.type || "group";
    }
}
