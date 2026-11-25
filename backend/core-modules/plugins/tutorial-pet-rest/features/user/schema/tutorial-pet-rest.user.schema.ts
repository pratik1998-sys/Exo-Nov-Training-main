import { TutorialPetRestQuery, TutorialPetRestResultSet } from "@plugin-tutorial-pet-rest/common/schema/tutorial-pet-rest.base.schema";

export interface TutorialPetRestUserBodyBase {
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    phone: string;
}

export interface TutorialPetRestUserBodyCreate extends TutorialPetRestUserBodyBase {
    username: string;
    password: string;
}

export interface TutorialPetRestUserBodyUpdate extends TutorialPetRestUserBodyBase { }

export interface TutorialPetRestUser {
    id: string;
    identifier: string;
    username: string;
    type: string;
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    phone: string;
    roles: string[];
}

export interface TutorialPetRestUserQuery extends TutorialPetRestQuery {
    identifiers?: string[];
    usernames?: string[];
}
export interface TutorialPetRestUserResultSet extends TutorialPetRestResultSet {
    results?: TutorialPetRestUser[];
}
