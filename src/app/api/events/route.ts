import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  // console.log("GET /api/events");

  try {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("date", { ascending: false });

      console.log("Fetched events data:", data);
      

    if (error) {
      console.error("Supabase select error:", error);
      throw error;
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Caught exception in GET /api/events:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch events.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  // console.log("POST /api/events");

  try {
    const body = await request.json();
    // console.log("Request Body for creation:", body);

    // Ensure id is not in the body for creation
    delete body.id;

    const { data, error } = await supabase
      .from("events")
      .insert(body)
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      throw error;
    }

    // console.log("Insert successful. Returning:", data);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Caught exception in POST /api/events:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create event.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  // console.log("PATCH /api/events");

  try {
    const body = await request.json();
    const { id, ...updateData } = body;
    // console.log("Request Body for update:", body);

    if (!id || id === "undefined") {
      console.error("Error: Invalid ID provided in payload for update:", id);
      return NextResponse.json(
        { error: "Invalid event ID provided in payload." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("events")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Supabase patch error:", error);
      throw error;
    }

    // console.log("Patch successful. Returning:", data);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Caught exception in PATCH /api/events:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update event.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest
) {
  const supabase = await createClient();
  const body = await request.json();
  const { id } = body;
  console.log(`DELETE 2 /api/events/${id}`);

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

    // console.log("Delete successful for ID:", id);
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
