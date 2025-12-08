import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function DELETE(
  request: NextRequest,
) {
  const supabase = await createClient();
  const body = await request.json();
  const { id } = body;
  console.log(`DELETE 1 /api/events/${id}`);

  if (!id || id === "undefined") {
    console.error("Error: Invalid ID provided for deletion:", id);
    return NextResponse.json(
      { error: "Invalid event ID provided for deletion." },
      { status: 400 }
    );
  }

  try {
    const { error } = await supabase.from("events").delete().eq("id", id);

    if (error) {
      console.error("Supabase delete error:", error);
      throw error;
    }

    console.log("Delete successful for ID:", id);
    return NextResponse.json(
      { message: "Event deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Caught exception in DELETE /api/events/[id]:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to delete event.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
