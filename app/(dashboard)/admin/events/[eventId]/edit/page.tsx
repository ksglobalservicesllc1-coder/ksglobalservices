import { getEventById } from "@/app/actions/eventAction";
import { EditEventClient } from "./client-page";

interface PageProps {
  params: {
    eventId: string;
  };
}

export default async function EditEventPage({ params }: PageProps) {
  const {eventId} = await params

  const event = await getEventById(eventId);
  
  
  return <EditEventClient initialData={event} eventId={eventId} />;
}