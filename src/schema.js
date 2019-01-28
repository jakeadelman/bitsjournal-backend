import { RegisterResolver } from "./modules/user/Register";
import { LoginResolver } from "./modules/user/Login";
import { MeResolver } from "./modules/user/Me";
import { ConfirmUserResolver } from "./modules/user/ConfirmUser";
import { buildSchema } from "type-graphql";

export const schema = async () => {
  await buildSchema({
    resolvers: [
      RegisterResolver,
      LoginResolver,
      MeResolver,
      ConfirmUserResolver
    ]
  });
};
