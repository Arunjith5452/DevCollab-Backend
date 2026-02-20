
export class PlanEntity {
    private readonly _id?: string;
    private _name: string;
    private _description: string;
    private _price: number;
    private _durationInDays: number;
    private _features: string[];
    private _isActive: boolean;
    private _type: 'one-time';
    private _projectLimit: number;
    private _maxContributors: number;
    private _participationLimit: number;
    private _stripePriceId?: string; // Optional: if we decide to sync with Stripe later

    private constructor(
        name: string,
        description: string,
        price: number,
        durationInDays: number,
        features: string[],
        isActive: boolean,
        type: 'one-time',
        projectLimit: number,
        maxContributors: number,
        participationLimit: number,
        id?: string,
        stripePriceId?: string
    ) {
        this._id = id;
        this._name = name;
        this._description = description;
        this._price = price;
        this._durationInDays = durationInDays;
        this._features = features;
        this._isActive = isActive;
        this._type = type;
        this._projectLimit = projectLimit;
        this._maxContributors = maxContributors;
        this._participationLimit = participationLimit;
        this._stripePriceId = stripePriceId;
    }

    static create(data: {
        name: string;
        description: string;
        price: number;
        durationInDays: number;
        features: string[];
        isActive?: boolean;
        type?: 'one-time';
        projectLimit?: number;
        maxContributors?: number;
        participationLimit?: number;
        id?: string;
        stripePriceId?: string;
    }): PlanEntity {
        return new PlanEntity(
            data.name,
            data.description,
            data.price,
            data.durationInDays,
            data.features,
            data.isActive ?? true,
            data.type ?? 'one-time',
            data.projectLimit ?? 1,
            data.maxContributors ?? 4,
            data.participationLimit ?? 1,
            data.id,
            data.stripePriceId
        );
    }

    get id(): string | undefined {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get description(): string {
        return this._description;
    }

    get price(): number {
        return this._price;
    }

    get durationInDays(): number {
        return this._durationInDays;
    }

    get features(): string[] {
        return this._features;
    }

    get isActive(): boolean {
        return this._isActive;
    }

    get type(): 'one-time' {
        return this._type;
    }

    get projectLimit(): number {
        return this._projectLimit;
    }

    get maxContributors(): number {
        return this._maxContributors;
    }

    get participationLimit(): number {
        return this._participationLimit;
    }

    get stripePriceId(): string | undefined {
        return this._stripePriceId;
    }

    // Methods to modify state
    activate() {
        this._isActive = true;
    }

    deactivate() {
        this._isActive = false;
    }

    updateDetails(data: { name?: string; description?: string; price?: number; durationInDays?: number; features?: string[]; projectLimit?: number; maxContributors?: number; participationLimit?: number }) {
        if (data.name) this._name = data.name;
        if (data.description) this._description = data.description;
        if (data.price !== undefined) this._price = data.price;
        if (data.durationInDays !== undefined) this._durationInDays = data.durationInDays;
        if (data.features) this._features = data.features;
        if (data.projectLimit !== undefined) this._projectLimit = data.projectLimit;
        if (data.maxContributors !== undefined) this._maxContributors = data.maxContributors;
        if (data.participationLimit !== undefined) this._participationLimit = data.participationLimit;
    }


}
