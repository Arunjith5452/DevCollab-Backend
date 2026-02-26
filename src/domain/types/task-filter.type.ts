import { Types } from 'mongoose';

export interface TaskFilter {
    projectId?: Types.ObjectId;
    assignedId?: string | { $in: string[] };
    status?: string | { $regex: string; $options: string } | { $ne: string };
    $or?: Array<{
        title?: { $regex: string; $options: string };
        description?: { $regex: string; $options: string };
        assignedId?: { $in: string[] };
    }>;

    [key: string]: string | Types.ObjectId | { $in: string[] } | { $regex: string; $options: string } | { $ne: string } | Array<Record<string, unknown>> | undefined;
}
