import PusherClient from "pusher-js";

export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY as string,
  {
    userAuthentication: {
      endpoint: "/api/pusher/auth",

      transport: "ajax"
    },
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER as string,
    channelAuthorization: {
      transport: "ajax",
      endpoint: "/api/pusher/auth"
    }
  }
);
