import { Types } from 'mongoose';

export interface ProjectFilter {
    status?: string | { $ne: string };
    creatorId?: string | Types.ObjectId;
    techStack?: { $in: string[] } | { $in: RegExp[] } | { $regex: RegExp } | { $all: RegExp[] };
    createdAt?: { $gte: Date; $lte?: Date } | { $gte?: Date; $lte: Date };
    _id?: string | Types.ObjectId;
    $or?: Array<{ title?: { $regex: string; $options: string }; description?: { $regex: string; $options: string } }>;
    [key: string]: string | Types.ObjectId | RegExp | { $in: string[] | RegExp[] } | { $all: RegExp[] } | { $regex: string | RegExp; $options?: string } | { $gte: Date; $lte?: Date } | { $gte?: Date; $lte: Date } | { $ne: string } | Array<Record<string, unknown>> | undefined;
}
