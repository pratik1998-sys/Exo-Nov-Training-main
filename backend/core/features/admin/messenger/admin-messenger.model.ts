import { Field } from "@api-decorators";
import { ResultSet } from "@feature/models";
import { InputType, ObjectType } from "@nestjs/graphql";

@InputType()
export class AdminMessengerTopicModelInput {
  @Field({ description: "topic id" })
  id: string;

  @Field({ type: () => Boolean, description: "is logging enabled" })
  isLoggingEnabled?: boolean;
}

@ObjectType()
export class AdminMessengerTopicModel {
  @Field({ description: "topic id" })
  id: string;

  @Field({ type: () => Boolean, description: "is logging enabled" })
  isLoggingEnabled?: boolean;
}

@ObjectType()
export class AdminMessengerModel {
  @Field({ description: "Messenger id" })
  id?: string;

  @Field({
    type: () => [AdminMessengerTopicModel],
    description: "Messenger topics",
  })
  topics?: AdminMessengerTopicModel[];
}

@InputType()
export class AdminMessengerModelInput {
  @Field({ description: "Messenger id" })
  id: string;

  @Field({ type: () => [AdminMessengerTopicModelInput], description: "topics" })
  topics: AdminMessengerTopicModelInput[];
}

@ObjectType()
export class AdminMessengerResultSet extends ResultSet<AdminMessengerModel> {
  @Field({ type: () => [AdminMessengerModel], description: "messengers" })
  results: AdminMessengerModel[];
}

export class AdminMessengersUpdateBody {
  messages: AdminMessengerModelInput[];
}
