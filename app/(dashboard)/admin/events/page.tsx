import { getAdminEvents } from "../../../actions/eventAction";
import { EventsClient } from "./client-page";

export default async function EventsPage() {
  const events = await getAdminEvents();
  
  return <EventsClient initialEvents={events} />;
}