import { Exclude, Expose } from "class-transformer";

@Exclude()
export class ActivityItemDTO {
    @Expose()
    type!: 'user' | 'project' | 'application';

    @Expose()
    id!: string;

    @Expose()
    name!: string;

    @Expose()
    email?: string;

    @Expose()
    title!: string;

    @Expose()
    desc!: string;

    @Expose()
    applicantName?: string;

    @Expose()
    projectTitle?: string;

    @Expose()
    status?: string;

    @Expose()
    createdAt!: Date;

    constructor(data: Partial<ActivityItemDTO>) {
        Object.assign(this, data);
    }
}
