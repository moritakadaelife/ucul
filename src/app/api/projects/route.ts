import { NextRequest, NextResponse } from 'next/server';
import getConfig from 'next/config';

export async function GET() {
  try {
    const { serverRuntimeConfig } = getConfig();
    const projects = serverRuntimeConfig.projects;

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error loading project config:', error);
    return NextResponse.json({ error: 'Failed to load projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { serverRuntimeConfig } = getConfig();
    const formData = await request.formData();
    const activeProject = formData.get('activeProject') as string;
    const files = formData.getAll('files');

    if (!activeProject || !serverRuntimeConfig.projects[activeProject]) {
      throw new Error(`Configuration not found for project: ${activeProject}`);
    }

    const { ENDPOINT, API_KEY } = serverRuntimeConfig.projects[activeProject];

    // Adjust this logic based on your server-side configuration
    // Ensure the server endpoint allows POST requests for file uploads
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'API-Key': API_KEY,
      },
      body: formData, // Directly send formData
    });

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error uploading data:', error);
    return NextResponse.json({ error: 'Failed to upload data' }, { status: 500 });
  }
}
