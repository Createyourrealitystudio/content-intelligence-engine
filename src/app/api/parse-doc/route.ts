import { NextResponse } from "next/server";
import mammoth from "mammoth";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await mammoth.extractRawText({ buffer });

    return NextResponse.json({ text: result.value });
  } catch (error) {
    console.error("Doc parse error:", error);
    return NextResponse.json(
      { error: "Could not parse that document. Try a .docx, .txt, or .md file." },
      { status: 500 }
    );
  }
}
