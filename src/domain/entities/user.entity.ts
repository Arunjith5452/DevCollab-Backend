import { hash } from "@/shared/utils/password-hash.utils";
import { ErrorMessage } from "../enums/messages/error-message.enum";
import { Status } from "../enums/status.enums";



export class UserEntity {
  // ... existing properties
  private readonly _id?: string;
  private _email: string;
  private _password: string;
  private _name: string;
  private _role: string;
  private _status: string;
  private _googleId?: string;
  private _profileImage?: string;
  private _githubProfile?: string;
  private _githubAccessToken?: string;
  private _bio?: string;
  private _title?: string
  private _techStack?: string[];
  private _createdAt?: Date;

  private constructor(
    email: string,
    password: string,
    name: string,
    role: string,
    status: string,
    googleId?: string,
    profileImage?: string,
    githubProfile?: string,
    id?: string,
    bio?: string,
    title?: string,
    techStack?: string[],
    githubAccessToken?: string,
    createdAt?: Date
  ) {
    this._email = email;
    this._password = password;
    this._name = name;
    this._role = role;
    this._status = status;
    this._googleId = googleId;
    this._profileImage = profileImage;
    this._githubProfile = githubProfile
    this._id = id;
    this._bio = bio;
    this._title = title
    this._techStack = techStack
    this._githubAccessToken = githubAccessToken
    this._createdAt = createdAt
    this._githubAccessToken = githubAccessToken
    this._createdAt = createdAt
  }

  static create(data: {
    email: string;
    password: string;
    username: string;
    role: string;
    status: string;
    googleId?: string;
    profileImage?: string,
    githubProfile?: string,
    id?: string;
    bio?: string;
    title?: string;
    techStack?: string[];
    githubAccessToken?: string;
    createdAt?: Date;
  }): UserEntity {
    return new UserEntity(
      data.email,
      data.password,
      data.username,
      data.role,
      data.status,
      data.googleId,
      data.profileImage,
      data.githubProfile,
      data.id,
      data.bio,
      data.title,
      data.techStack,
      data.githubAccessToken,
      data.createdAt
    );
  }



  // ... existing getters ...

  // ... rest of the file

  updateProfile(data: {
    name?: string;
    bio?: string;
    title?: string;
    profileImage?: string;
    techStack?: string[];
  }) {
    if (data.name) {
      if (data.name.length < 3)
        throw new Error("Name must be at least 3 characters");
      this._name = data.name;
    }

    if (data.bio) {
      if (data.bio.length > 300)
        throw new Error("Bio cannot exceed 300 characters");
      this._bio = data.bio;
    }

    if (data.title) this._title = data.title;

    if (data.profileImage) this._profileImage = data.profileImage;

    if (data.techStack) this._techStack = data.techStack;
  }

  get id(): string | undefined {
    return this._id;
  }

  get email(): string {
    return this._email
  }

  get username(): string {
    return this._name;
  }

  get password(): string {
    return this._password
  }

  get role(): string {
    return this._role
  }

  get status(): string {
    return this._status
  }

  get googleId(): string | undefined {
    return this._googleId
  }

  get bio(): string | undefined {
    return this._bio
  }

  get profileImage(): string | undefined {
    return this._profileImage
  }

  get title(): string | undefined {
    return this._title
  }

  get techStack(): string[] | undefined {
    return this._techStack
  }
  get githubProfile(): string | undefined {
    return this._githubProfile
  }

  isBlocked() {
    if (this._status === Status.BLOCK) {
      throw new Error(ErrorMessage.ADMIN_BLOCKED)
    }

  }
  setPassword(newPassword: string) {
    this._password = newPassword
  }

  async getHashedPassword() {
    return await hash(this.password)
  }

  get githubAccessToken(): string | undefined {
    return this._githubAccessToken
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

}