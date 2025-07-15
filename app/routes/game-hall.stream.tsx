import type { LoaderFunctionArgs } from "@remix-run/node";
import { createEventStream } from "~/utils/create-event-stream.server";

export async function loader({ request }: LoaderFunctionArgs) {
    // const url = new URL(request.url);
    // const sessionCode = url.searchParams.get("sessionCode");
    // if (!sessionCode) {
    //     throw new Error("No session code provided");
    // }
  return createEventStream(request, "players");
}