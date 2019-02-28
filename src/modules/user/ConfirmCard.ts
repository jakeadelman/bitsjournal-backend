import { Resolver, Mutation, Arg } from "type-graphql";

import { User } from "../../entity/User";
// import { redis } from "../../redis";
const stripe = require("stripe")("sk_test_bCGcyxmE3CahvatloCKNPVJV");

@Resolver()
export class ConfirmCardResolver {
  @Mutation(() => Boolean)
  async confirmCard(
    @Arg("uid") uid: string,
    @Arg("source") sourceId: string
  ): Promise<boolean> {
    // const userId = await redis.get(token);

    // if (!userId) {
    //   return false;
    // }
    // console.log("confirming", uid, sourceId);
    let user = await User.findOne({ where: { id: parseInt(uid) } });
    if (!user) {
      return false;
    }

    const customer = await stripe.customers.create({
      email: user!.email,
      source: sourceId
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ plan: "plan_EbX1gzFjyRznJc" }],
      trial_from_plan: true
    });

    // console.log(subscription);
    if (!subscription) {
      return false;
    }

    await User.update({ id: parseInt(uid) }, { confirmed: true });
    // await redis.del(token);
    console.log("confirmed user in db");

    return true;
  }
}
