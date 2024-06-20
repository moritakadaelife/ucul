import { NextResponse } from 'next/server';
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
