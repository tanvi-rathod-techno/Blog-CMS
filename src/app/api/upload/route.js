import { writeFile } from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return NextResponse.json({ message: 'No file provided', success: false }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filePath = path.join(process.cwd(), 'public', file.name);
    await writeFile(filePath, buffer);

    return NextResponse.json({ message: 'File uploaded successfully', success: true ,fileName: file.name,}, { status: 200 });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ message: 'Upload failed', success: false }, { status: 500 });
  }
}
